import json
import requests
from functools import reduce
from bs4 import BeautifulSoup as bs


def getJson(url, path = None):
    # path = "foo.baaa.wibble"
    try:
        ret = {}
        res = requests.get(url)
        json = res.json()
        if json and path:
            ret = reduce(lambda acc,i: acc[i], path.split('.'), json)
            return ret
        if json:
            return json
    except Exception as error:
        print(str(error))
        return {}

def getJsonLD(url):
    # This returns the body of a json_LD script from openActive api
    try:
        ret = {}
        html = requests.get(url).content
        soup = bs(html, "html.parser")
        for script in soup.find_all("script"):
            type =  script.attrs.get("type",'')
            if type != '' and type == 'application/ld+json':
                return json.loads(script.text)
        return {}
    except Exception as error:
            print(str(error))
            return {}
