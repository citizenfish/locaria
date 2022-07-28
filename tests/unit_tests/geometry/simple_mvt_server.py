import http.server
import socketserver
import psycopg
import os
import re

HOST_NAME = "localhost"
PORT = 8080
sql = "SELECT locaria_core.geometry_to_mvt('locaria_tests.census_data_output_areas', locaria_core.xyz_tile_to_bbox(%s,%s,%s))"

def get_local_config(path):
    try:
        f = open(path)
        config = json.load(f)
        f.close()
    except FileNotFoundError:
        print("Using defaults for theme")
        return {'db_var': 'LOCARIADB', 'theme':'main', 's3_var': 'S3DLBUCKET'}
    return config

config = get_local_config('config.json')
env_var = f"{config['db_var']}_{config['theme']}"
os.environ['LOCARIADB'] = os.environ[env_var]
DATABASE_CONNECTION =  psycopg.connect(os.environ[env_var])

class SimpleHTTPRequestHandler(http.server.BaseHTTPRequestHandler):

    def do_GET(self):

        print(self.path)
        m = re.search(r'^\/(\d+)\/(\d+)\/(\d+)\.(\w+)', self.path)
        z = int(m.group(1))
        x = int(m.group(2))
        y = int(m.group(3))
        print(f"zoom: {z} x: {x} y : {y}")
        query = DATABASE_CONNECTION.execute(sql, [x,y,z])
        ret = query.fetchone()[0]
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Content-type", "application/vnd.mapbox-vector-tile")
        self.end_headers()
        self.wfile.write(ret)


with http.server.HTTPServer((HOST_NAME,PORT), SimpleHTTPRequestHandler) as server:
    try:
        print("serving at port", PORT)
        server.serve_forever()
    except KeyboardInterrupt:
        if self.DATABASE_CONNECTION:
            self.DATABASE_CONNECTION.close()
        print('^C received, shutting down server')
        server.socket.close()
