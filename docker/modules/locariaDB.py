import psycopg2
from psycopg2 import extras
import os
import json
SCHEMA  = 'locaria_core'
ACL = {"_groups": ["Admins"]}
MAX_RETRIES = 5

class locariaDB:

    def __init__(self, config, debug = True):

        # locaria DB connections are named from theme and environment
        env_var = f"{config['db_var']}_{config['theme']}{config['environment']}"
        self.debug = debug
        self.config = config
        self.lastError = []

        try:
            if debug: print(f"Establishing database connection using {env_var}")
            self.conn = psycopg2.connect(os.environ[env_var])
            if debug: print("Database connection established")
            self.connection = True

        except Exception as error:
            print("Cannot connect to database ... exiting", error)
            self.connection = False

        self.acl = ACL
        self.schema = SCHEMA

    def close(self):
        self.conn.close()
        self.connection = False
        return None

    def setError(self, error):
        e = str(error)
        self.lastError.append(e)
        return e

    def query(self, query, parameters = None,  query_type = 'standard',):

        cursor = self.conn.cursor()

        try:

            if query_type == 'values':
                extras.execute_values(cursor, query, parameters)
            elif not parameters:
                cursor.execute(query)
            else:
                cursor.execute(query, parameters)

            if cursor.pgresult_ptr is not None:
                ret = cursor.fetchall()
            else:
                ret = [{"query" : query, "result" : "success"}]

            self.conn.commit()
            cursor.close()
            return ret

        except Exception as error:
            print("ERROR")
            print(str(error))

            try:
                cursor.execute("ROLLBACK")
                self.conn.commit()
                #cursor.close()
            except Exception as close_error:
                self.setError(str(close_error))

            if self.conn.closed == 1:
                print(f"Query Error {str(error)} attempting reconnection")
                self.__init__(self.config,self.debug)
            else:
                e = self.setError(error)
                return [{"error" : e, "query" : query}]

    def internalGateway(self, method, parameters, public = 'internal_'):

        parameters["method"] = method
        query = f"SELECT {self.schema}.locaria_{public}gateway(%s,%s) AS ig"

        try:
            res = self.query(query,(json.dumps(parameters), json.dumps(self.acl)))
            return res[0]

        except Exception as error:
            print(f"{public}Gateway Error {e}")
            e = self.setError(str(error))
            return {"error" : e}

    def publicGateway(self, method, parameters):
        return self.internalGateway(method, parameters, public = '')

    def getParameter(self, parameter_name):

        parameters = self.internalGateway('get_parameters', {"parameter_name": parameter_name})[0]
        return parameters.get('parameters', {}).get(parameter_name,{}).get('data',{})

    def setParameter(self, parameter_name, value):

        return self.internalGateway('set_parameters', {"parameter_name": parameter_name, "parameters" : value})

    def bulkInserter(self, query, values):

        try:
            self.query(query, values, 'values')

        except Exception as error:
            e = self.setError(str(error))
            print(f"bulkInsertor error {e}")
            return {}

        return {"bulkJsonInserter" : "OK"}

    def placeGeocoder(self, place):

        return self.publicGateway('location_search', {'location' : place})[0]
