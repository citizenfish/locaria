import sys
sys.path[0:0] = ['../../docker/modules']
from locaria_file_utils import *


config = get_local_config('config.json')
db = database_connect(config)
au = get_parameters(db, 'assets_url')
print(au)
