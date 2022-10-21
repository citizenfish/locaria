import sys
import re
sys.path[0:0] = ['../modules']
from locaria_api_utils import *

INSERT_SCHEMA = 'locaria_uploads'

class sustainablefoodplaces:

    def __init__(self, site, debug = True):
        self.urls = site.get('urls',[])
        self.debug = debug
        self.params = site
        self.params.pop('urls', None)
        self.table = site.get('table', 'sustainablefoodplaces')

        self.table_create = f"CREATE TABLE IF NOT EXISTS {INSERT_SCHEMA}.{self.table}(url TEXT PRIMARY KEY, attributes JSONB)"
        self.insert = f"INSERT INTO {INSERT_SCHEMA}.{self.table} (url, attributes) VALUES %s ON CONFLICT(url) DO UPDATE SET attributes=EXCLUDED.attributes"

    def processUrls(self, db):

        db.query(self.table_create)

        if self.debug: print(f"Processing sustainablefoodplaces: {len(self.urls)}")
        features = []
        # First dig out the titles and geocords
        scripts = getScripts(self.params['url'])
        latlngs = re.findall('Latlng([0-9]+).*\((.*)\).*',scripts)
        titles = re.findall("title([0-9]+).*'(.*)'",scripts)
        suffixes = re.findall('html([0-9]+).*href=\\\["](/[a-z]+/[a-z]+/)',scripts)

        for index, (s, l, t) in enumerate(zip(suffixes, latlngs, titles)):
            url = f"{self.params['domain']}{s[1]}"
            feature = getLocariaInfo(url,self.params)
            point = l[1].replace(' ','').split(',')
            feature['geometry'] = f"SRID=4326;POINT({point[1]} {point[0]})"
            feature['description']['title'] = t[1]
            features.append((url, json.dumps(feature)))


        res = db.bulkInserter(self.insert, features)


        return res

classSelectors = {'sustainablefoodplaces' : sustainablefoodplaces}