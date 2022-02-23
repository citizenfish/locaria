import requests
import time
import json

def custom_loader_main(func,db,file):
    if func == 'planning_loader':
        return planning_loader(db,file)
    elif func == 'flood_loader':
        return flood_loader(db,file)
    else:
        return 'ERROR'

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

    return {'path': path}

def planning_loader(db,file):
    base_url = file['attributes']['url']
    page = file['attributes']['index'] if 'index' in file['attributes'] else 1000
    index = file['attributes']['page'] if 'page' in file['attributes'] else 0
    recent = file['attributes']['recent'] if 'recent' in file['attributes'] else 60

    if not 'authority' in file['attributes']:
        return {'status' : 'ERROR', 'result' : 'Missing authority', 'message' : 'Missing authority code for planning_loader'}

    fetch = True
    fetched = 0
    rate_limit = 5
    remaining = 0
    path = file['attributes']['path']

    data = []
    while(fetch):
        url = f"{base_url}?auth={file['attributes']['authority']}&recent={recent}&pg_sz={page}&index={index}"
        req = requests.get(url)
        if req == None or not 'total' in req.json():
            fetch = False
            continue

        req_data = req.json()

        if int(req_data['total']) > 0:
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

    return {'path': path}