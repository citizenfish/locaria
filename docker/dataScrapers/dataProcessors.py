import sys
import re
import json
import requests
from requests.auth import HTTPBasicAuth

sys.path[0:0] = ['../modules']
from locaria_api_utils import *

INSERT_SCHEMA = 'locaria_data'

#TODO split classes into own files

class sustainablefoodplaces:

    def __init__(self, site, debug = True):
        self.urls = site.get('urls',[])
        self.debug = debug
        self.params = site
        self.params.pop('urls', None)
        self.table = site.get('table', 'sustainablefoodplaces')

        #self.table_create = f"CREATE TABLE IF NOT EXISTS {INSERT_SCHEMA}.{self.table}(url TEXT PRIMARY KEY, attributes JSONB)"
        self.insert = f"INSERT INTO {INSERT_SCHEMA}.{self.table} (url, attributes) VALUES %s ON CONFLICT(url) DO UPDATE SET attributes=EXCLUDED.attributes"

    def processUrls(self, db):

        #db.query(self.table_create)

        if self.debug: print(f"Processing sustainablefoodplaces: {len(self.urls)}")
        features = []
        # First dig out the titles and geo-coords
        scripts = getScripts(self.params['url'])
        latlngs = re.findall('Latlng([0-9]+).*\((.*)\).*',scripts)
        titles = re.findall("title([0-9]+).*'(.*)'",scripts)
        suffixes = re.findall('html([0-9]+).*href=\\\["](/[a-z]+/[a-z]+/)',scripts)

        for index, (s, l, t) in enumerate(zip(suffixes, latlngs, titles)):
            url = f"{self.params['domain']}{s[1]}"
            feature = getLocariaInfo(url, self.params)
            point = l[1].replace(' ','').split(',')
            feature['geometry'] = f"SRID=4326;POINT({point[1]} {point[0]})"
            feature['lon'] = point[1]
            feature['lat'] = point[0]
            feature['description']['title'] = t[1]
            features.append((url, json.dumps(feature)))


        res = db.bulkInserter(self.insert, features)


        return res

class mindlocations:
    def __init__(self, params, debug = True):

        self.debug = debug
        self.params = params
        self.table = params.get('table', 'mindlocations')

        #self.table_create = f"CREATE TABLE IF NOT EXISTS {INSERT_SCHEMA}.{self.table}(location TEXT PRIMARY KEY, attributes JSONB) INHERITS({INSERT_SCHEMA}.base_table)"
        self.insert = f"INSERT INTO {INSERT_SCHEMA}.{self.table} (location, attributes) VALUES %s ON CONFLICT(location) DO UPDATE SET attributes=EXCLUDED.attributes"

    def processJson(self, db):
        #db.query(self.table_create)
        if self.debug: print(f"Processing mindlocations: {self.params['uri']}")
        features = []
        f = open(self.params['uri'])
        json_data = json.load(f)
        for mind in json_data:
            features.append( (mind['name'], json.dumps(mind)) )

        res = db.bulkInserter(self.insert, features)

class datathistle:
    def __init__(self, parameters, debug = True):
        self.url = parameters.get('url','https://api.list.co.uk/v1/events')
        self.debug = debug
        self.table = parameters.get('table', 'datathistle')
        self.insert_places = f"INSERT INTO {INSERT_SCHEMA}.{self.table}_places (place_id, attributes) VALUES %s ON CONFLICT(place_id) DO UPDATE SET attributes=EXCLUDED.attributes"
        self.insert = f"INSERT INTO {INSERT_SCHEMA}.{self.table} (event_id, attributes) VALUES %s ON CONFLICT(event_id) DO UPDATE SET attributes=EXCLUDED.attributes"
        self.api_key = parameters.get('apikey','')
        self.lon = parameters.get('lon', None)
        self.lat = parameters.get('lat', None)
        self.distance = parameters.get('distance', None)
        self.direct = parameters.get('direct', False)

    def processAPI(self,db):
        if self.debug: print(f"Processing datathistle: {self.url}")
        if not self.lon or not self.lat or not self.distance:
            return {'error' : 'missing parameters'}

        if not self.direct:
            url = f"{self.url}?near={self.lat},{self.lon}/{self.distance}"
        else:
            url = self.url

        count = 0
        while True:
            events = []
            places = []
            print(f"Fetching from {url}")

            res = requests.get(url, headers={'Authorization': f"Bearer {self.api_key}"})

            for p in res.json()['places']:
                places.append((p['place_id'], json.dumps(p)))

            for e in res.json()['events']:
                events.append((e['event_id'], json.dumps(e)))

            print(f"Inserting {len(places)} place records")
            db_res = db.bulkInserter(self.insert_places, places)

            print(f"Inserting {len(events)} event records")
            db_res = db.bulkInserter(self.insert, events)

            url = res.links.get('next', '')
            count += len(events)
            if url == '':
                break
            url = url['url']

        return {'inserts' : count}

classSelectors = {'sustainablefoodplaces' : sustainablefoodplaces, 'mindlocations' : mindlocations, 'datathistle': datathistle}