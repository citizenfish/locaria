import requests
from requests.auth import HTTPBasicAuth
import time
import json
import re
from zipfile import ZipFile
import sys
sys.path[0:0] = ['../modules']
from locaria_file_utils import get_parameters
from dateutil.relativedelta import relativedelta
import datetime

def custom_loader_main(db,file):
    func = file["attributes"]["custom_loader"]
    if func == 'planning_loader':
        return planning_loader(db,file)
    elif func == 'flood_loader':
        return flood_loader(db,file)
    elif func == 'os_opendata':
        return os_opendata_loader(db, file)
    elif func == 'crime_loader':
        return crime_loader(db,file)
    elif func == 'thelist_events':
        return thelist_events(db,file)
    elif func == 'reed_jobs':
        return reed_jobs(db,file)
    else:
        return 'ERROR'

def reed_jobs(db,file):
    parameters = get_parameters(db,'reed_jobs').get('reed_jobs',{})
    apiKey = parameters.get('apiKey')
    reedUrl = parameters.get('url', 'https://www.reed.co.uk/api/1.0/search')
    locationName = parameters.get('locationName')

    if apiKey == None or locationName == None:
        return {'status' : 'ERROR', 'message' : 'Missing apiKey or locationName'}

    locationDistance = parameters.get('locationDistance', 5)
    reedUrl = f"{reedUrl}?&locationName={locationName}&distanceFromLocation={locationDistance}"

    res = requests.get(reedUrl, auth = HTTPBasicAuth(apiKey, ''))
    jobs = res.json()
    tmp_dir = file["attributes"]["tmp_dir"]
    path = f"{tmp_dir}/reed_jobs.json"

    #Make GeoJson even though we have no coords
    features = []
    for f in jobs['results']:
        features.append({'type' : 'Feature', 'geometry' : {'type' : 'Point', 'coordinates' : [parameters.get('defaultGeometryX'), parameters.get('defaultGeometryY')]}, 'properties' : f})

    data = {'type' : 'FeatureCollection'}
    data['features'] = features
    writeFileJson(path,data)

    response = {
        'filename': path,
        'table_name': parameters.get('table_name', file['table_name']),
        'post_process_report': parameters.get('post_process_report', file['attributes'].get('post_process_report',''))
    }

    return response

def thelist_events(db,file):
    parameters = get_parameters(db,'thelist_events').get('thelist_events',{})
    eventsUrl = parameters.get('url', 'https://api.list.co.uk/v1/events')
    eventsAPIKey = parameters.get('key', 'WILLFAIL')
    if eventsAPIKey == 'WILLFAIL':
        print(parameters)
        return {'status' : 'ERROR', 'message' : 'NO API KEY'}

    # Step one, get the max distance in miles for our chose authority
    la_id = file['attributes'].get('bounding_la_id', '')
    if la_id == '':
        return {'status' : 'ERROR', 'result' : 'Local authority id required'}

    query = """ SELECT ROUND(radius::NUMERIC * 0.000621371, 2) AS miles,
                ST_X(ST_TRANSFORM(center,4326)) AS lon,
                ST_Y(ST_TRANSFORM(center,4326)) AS lat
                FROM (

                        SELECT (ST_MINIMUMBOUNDINGRADIUS(ST_TRANSFORM(wkb_geometry,3857))).*
                        FROM locaria_data.local_authority_boundary
                        WHERE id = %s::BIGINT
                ) MBR """
    mbr = db.execute(query, [la_id]).fetchone()

    # Step two call events api to get events within this distance
    events = []
    url = f"{eventsUrl}?near={mbr[2]},{mbr[1]}/{mbr[0]}"

    count = 0
    while True:
        res = requests.get(url, headers={'Authorization': f"Bearer {eventsAPIKey}"})
        events.extend(res.json())
        print(res.json())
        url = res.links.get('next', '')
        if url == '':
            break
        url = url['url']

    tmp_dir = file["attributes"]["tmp_dir"]
    path = f"{tmp_dir}/events.json"
    features = []
    for f in events:
        print(f)
        lon = f['schedules'][0]['place']['lng']
        lat = f['schedules'][0]['place']['lat']
        features.append({'type' : 'Feature', 'geometry' : {'type' : 'Point', 'coordinates' : [lon,lat]}, 'properties' : f})
    data = {'type' : 'FeatureCollection'}
    data['features'] = features
    writeFileJson(path,data)

    response = {
        'filename': path,
        'table_name': parameters.get('table_name', file['table_name']),
        'post_process_report': parameters.get('post_process_report', file['attributes'].get('post_process_report',''))
    }

    return response


def crime_loader(db,file):

    parameters = get_parameters(db,'crime_loader').get('crime_loader',{})
    crimesUrl = parameters.get('url', 'https://data.police.uk/api/')
    force = file['attributes'].get('force', parameters.get('force', None))

    if not force:
        return {'status' : 'REGISTERED', 'result' : 'Force not specified', 'message' : 'A force must be specified to load crime data'}


    crimes = []
    outcomes = []
    events = []
    teams = []
    priorities = []
    boundaries = []
    loadFiles = []


    # Step 1 - identify the neighbourhoods for the force
    neighbourhoods = requests.get(f"{crimesUrl}{force}/neighbourhoods").json()

    # Step 2 download the data for each of these
    for neighbourhood in neighbourhoods:
        boundary = requests.get(f"{crimesUrl}{force}/{neighbourhood['id']}/boundary").json()
        if len(boundary) < 1: continue

        # Construct a neighbourhood polygon for future lookup calls
        poly = [] #Used by crimes API
        geopoly = [] #Our constructed geometry

        for coordinate in boundary:
            poly.append(f"{coordinate['latitude']},{coordinate['longitude']}")
            geopoly.append([float(coordinate['longitude']),float(coordinate['latitude'])])

        # Get neighbourhood data and centroid for other calls that do not return geojson
        ndetails = requests.get(f"{crimesUrl}{force}/{neighbourhood['id']}").json()
        nlat = ndetails['centre']['latitude']
        nlon = ndetails['centre']['longitude']
        neighbourhood = {**neighbourhood, **ndetails}
        neighbourhood['force'] = force
        boundaries.append({'type' : 'Feature', 'geometry' : {'type' : 'Polygon', 'coordinates' : [geopoly]}, 'properties' : neighbourhood})

        # Either retrieve for a set date or go back 3 months from current
        tm = datetime.date.today() - relativedelta(months=3)
        month = file['attributes'].get('crime_date', tm.strftime("%Y-%m"))
        postParams = {'poly' : ':'.join(poly), 'date' : month}

        #Get Crimes
        print(f"Downloading Crime for {postParams['date']}")
        crime = requests.post(f"{crimesUrl}crimes-street/all-crime", postParams)
        if  crime.status_code == 200 and len(crime.json()) > 0:
            features = []
            for f in crime.json():
                f['force'] = force
                f['neighbourhood'] = neighbourhood['id']
                features.append({'type' : 'Feature', 'geometry' : {'type' : 'Point', 'coordinates' : [float(f['location']['longitude']),float(f['location']['latitude'])]}, 'properties' : f})
            crimes.extend(features)
        else:
            print(f"Crimes failure {crime}")

        #Get outcomes
        print(f"Downloading Outcome for {postParams['date']}")
        outcome = requests.post(f"{crimesUrl}outcomes-at-location", postParams)
        if outcome.status_code == 200 and len(outcome.json()) > 0:
            features = []
            for f in outcome.json():
                f['force'] = force
                f['neighbourhood'] = neighbourhood['id']
                features.append({'type' : 'Feature', 'geometry' : {'type' : 'Point', 'coordinates' : [float(f['crime']['location']['longitude']),float(f['crime']['location']['latitude'])]}, 'properties' : f})
            outcomes.extend(features)
        else:
            print(f"Outcome failure {outcome}")

        #Get team
        print(f"Downloading Team {crimesUrl}{force}/{neighbourhood['id']}/people")
        team = requests.get(f"{crimesUrl}{force}/{neighbourhood['id']}/people")
        if team.status_code == 200 and len(team.json()) > 0:
            teams.append({'type' : 'Feature', 'geometry' : {'type' : 'Point', 'coordinates' : [float(nlon),float(nlat)]}, 'properties': {'neighbourhood' : neighbourhood['id'], 'force' : force, 'team' : team.json()}})
        else:
            print(f"Team failure {team}")

        #Get events
        print(f"Downloading Events {crimesUrl}{force}/{neighbourhood['id']}/events")
        event = requests.get(f"{crimesUrl}{force}/{neighbourhood['id']}/events")
        if event.status_code == 200 and len(event.json()) > 0:
            events.append({'type' : 'Feature', 'geometry' : {'type' : 'Point', 'coordinates' : [float(nlon),float(nlat)]}, 'properties': {'month' : month, 'neighbourhood' : neighbourhood['id'], 'force' : force, 'event' : event.json()}})
        else:
            print(f"Events failure {event}")

        #Get priorities
        print(f"Downloading Priorities {crimesUrl}{force}/{neighbourhood['id']}/priorities")
        priority = requests.get(f"{crimesUrl}{force}/{neighbourhood['id']}/priorities")
        if priority.status_code == 200 and len(priority.json()) > 0:
            priorities.append({'type' : 'Feature', 'geometry' : {'type' : 'Point', 'coordinates' : [float(nlon),float(nlat)]}, 'properties': {'neighbourhood' : neighbourhood['id'], 'force' : force, 'priority' : priority.json()}})
        else:
            print(f"Priority failure {priority}")

    # Now write them out to files for processing
    schema = file['schema']
    if len(boundaries) > 0: loadFiles.append({'table': f"{schema}.crime_neighbourhoods", 'file': 'boundary.json', 'data': boundaries, 'geojson' : True})
    if len(crimes) > 0:     loadFiles.append({'table': f"{schema}.crime_streetcrimes", 'file': 'crimes.json', 'data': crimes, 'geojson' : True, 'flatten': True})
    if len(outcomes) > 0:   loadFiles.append({'table': f"{schema}.crime_outcomes", 'file': 'outcomes.json', 'data': outcomes, 'geojson' : True, 'flatten': True})
    if len(teams) > 0:      loadFiles.append({'table': f"{schema}.crime_teams", 'file': 'teams.json', 'data': teams, 'geojson' : True})
    if len(events) > 0:     loadFiles.append({'table': f"{schema}.crime_events",'file': 'events.json', 'data': events, 'geojson' : True})
    if len(priorities) > 0: loadFiles.append({'table': f"{schema}.crime_priorities", 'file': 'priorities.json', 'data': priorities, 'geojson' : True})


    tmp_dir = file["attributes"]["tmp_dir"]
    data = {'type' : 'FeatureCollection'}
    multifile =[]
    for f in loadFiles:
        if 'geojson' in f:
            data['features'] = f['data']
        else:
            data = f['data']
        path = f"{tmp_dir}/{f['file']}"
        writeFileJson(path,data)
        multifile.append({'path' : path, 'table' : f['table'], 'flatten' : f.get('flatten', False)})

    return {'multifile' : multifile, 'message' : 'Processed multiple files for Crime'}

def writeFileJson(path,data):
    print(f"Writing {path}")
    with open(path, 'w') as p:
        json.dump(data,p)
    return path

def os_opendata_loader(db,file):

    parameters = get_parameters(db,"opennames_loader").get('opennames_loader',{})

    url = parameters.get('os_opendata_api_url','https://api.os.uk/downloads/v1/products')
    os_products = requests.get(url).json()

    # First we get a list of all products, then extract the download url from the one we want
    downloadURL = ''
    for product in os_products:
        if product['id'] == file["attributes"]["product"]:

            # Next we have to get details of the product we require
            product_details = requests.get(product['url']).json()
            #Check whether this version is already loaded
            lastVersion  = parameters.get('opennames_version', '')
            if lastVersion == product_details['version']:
                return {'status' : 'CANCELLED', 'result' : 'OS LOADER', 'message' : f"Version {lastVersion} already loaded"}

            print(f"Loading version {product_details['version']}")
            # Finally we have to get a download url for the format we are interest in
            format_list = requests.get(product_details["downloadsUrl"]).json()
            format = file["attributes"].get("format", "GeoPackage")
            for formats in format_list:
                if formats["format"] == format:
                    print(f"Loading format {format}")
                    downloadURL = formats['url']
                    break

    # Now get a temp dir and download zip file to it
    tmp_dir = file["attributes"]["tmp_dir"]
    print(f"Downloading from {downloadURL} to temporary directory: {tmp_dir}")
    osData = requests.get(downloadURL)
    tmpZipFile = f"{tmp_dir}/osData.zip"
    with open(tmpZipFile, 'wb') as f:
        f.write(osData.content)

    # OS Zip files contain all sorts of stuff we are not interested in
    with ZipFile(tmpZipFile) as extractor:
        extractor.extractall(tmp_dir)
        zipList = extractor.namelist()

    # Look for gpkg by default but can be overridden
    searchExt = '\.' + file["attributes"].get('ext', 'gpkg')

    retFileName = ''
    for unZippedFile in zipList:
        if re.search(searchExt, unZippedFile):
            retFileName = tmp_dir + "/" + unZippedFile
            break

    if(retFileName) == '':
        return {'status' : 'ERROR', 'result' : 'OS LOADER', 'message' : 'Extension not found in OS zipfile'}

    print(retFileName)
    return {'filename' : retFileName, 'version' : product_details['version']}

def flood_loader(db,file):
    print ("Flood Loader")

    base_url = 'https://environment.data.gov.uk/flood-monitoring/id/'
    if not 'name' in file['attributes']:
        return {'status' : 'ERROR', 'result' : 'Missing county', 'message' : 'Missing county for flood_loader'}

    path = file['attributes']['path']
    url = f"{base_url}floods?county={file['attributes']['county']}"
    req = requests.get(url)
    req_data = req.json()
    data = req_data['items']
    print(data)
    if len(data) > 0:
        #format as geojson
        geojson = {'type' : 'FeatureCollection'}
        features = []
        # get floodarea centroid
        for f in data:
            url = f"{base_url}floodAreas/{f['floodAreaID']}"
            req = requests.get(url)
            station = req.json()
            f['longitude'] = station['items']['long']
            f['latitude'] = station['items']['lat']
            f['url'] = f['@id']
            features.extend([{'type' : 'Feature', 'geometry' : {'type' : 'Point', 'coordinates' : [f['longitude'],f['latitude']]}, 'properties' : f}])

        geojson['features'] = features
        print(f"Writing to {path}")
        with open(path, 'w') as p:
            json.dump(geojson,p)

    else:
        return {'status' : 'ERROR', 'result' : 'No flood data', 'message' : 'No flood data'}

    return {'filename': path}

def planning_loader(db,file):

    parameters = get_parameters(db,"planning_loader").get('planning_loader', {})
    base_url = parameters.get('url', 'https://www.planit.org.uk/api/applics/json')
    pageSize = file['attributes'].get('pageSize', 1000)
    index = file['attributes'].get('index', 0)
    recent = file['attributes'].get('recency', 60)

    if not 'authority' in file['attributes']:
        return {'status' : 'ERROR', 'result' : 'Missing authority', 'message' : 'Missing authority code for planning_loader'}

    fetch = True
    fetched = 0
    rate_limit = 5
    remaining = 0
    path = file['attributes']['path']

    data = []
    while(fetch):
        url = f"{base_url}?auth={file['attributes']['authority']}&recent={recent}&pg_sz={pageSize}&index={index}"


        req = requests.get(url)
        if req == None or not 'total' in req.json():
            fetch = False
            continue

        req_data = req.json()

        print(req_data['total'])


        if str(req_data['total']).isnumeric() and int(req_data['total']) > 0:
            data.extend(req.json()['records'])
            to = int(req_data['to'])
            total = int(req_data['total'])
        else:
            fetch = False
            continue

        if total <= to + 1:
            fetch = False
            continue

        remaining = total - to + 1
        index = to + 1
        page = page if remaining > page else remaining
        fetched = fetched + 1

        if(fetched >= rate_limit):
            print('Paused for rate limit')
            fetched = 0
            time.sleep(60)

    if len(data) > 0:
        #format as geojson
        geojson = {'type' : 'FeatureCollection'}
        features = []
        for f in data:
           # f['text'] = f['message']
           # f['title'] = f['description']
            features.extend([{'type' : 'Feature', 'geometry' : {'type' : 'Point', 'coordinates' : [f['location_x'], f['location_y']]}, 'properties' : f}])

        geojson['features'] = features

        print(f"Writing to {path}")
        with open(path, 'w') as p:
            json.dump(geojson,p)

    return {'filename': path}