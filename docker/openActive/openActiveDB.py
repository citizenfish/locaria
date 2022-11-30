import sys
import json
import re
from more_itertools import unique_everseen
from operator import itemgetter

sys.path[0:0] = ['../modules']
from locariaDB import *
from dbConfig import *

class openActiveDB(locariaDB):
    def __init__(self,config,debug = True):
        # Run the parent constructor which handles db connection etc
        locariaDB.__init__(self,config,debug)
        # Create any tables that have not been set up already

        if self.connection:
            for q in TABLE_CREATES:
                self.query(q)
            self.conn.commit()

    def insertJson(self, types, data, org):

        # Convert all types to lower case to ensure comparison with kind works if feeds don't camel case
        types = [c.lower() for c in types]
        items = {}
        ret = {'errors' :[]}
        for type in types:
            items[type] = []

        # We have to convert to tuples to use execute_values in psycopg2 we also have to split items into types
        for i in data:
            kind = i.get('kind','errors')
            try:
                kind = kind.lower() # to cope with Event, event etc...
                kind = re.split(r'[^a-zA-Z]', kind)[0] # to cope with scheduledsession.sessionseries or facilityuse/slot etc...
            except Exception as error:
                kind = 'errors'

            if kind in types:
                items[kind].append((org, i.get('id'), i.get('modified'), json.dumps(i)))
            else:
                if kind == 'errors':
                    i['org'] = org
                    ret['errors'].append({"missing_kind" : kind, "data" : i})
                else:
                    print(f"ignored {kind}")
                    ret['errors'].append({"unconfigured_kind" : kind})

        for table in items:

            if len(items[table]) > 0:
                # We now have to sift for duplicate id,org and pick the latest modified to prevent "ON CONFLICT DO UPDATE command cannot affect row a second time"
                _insert_data = items[table]
                _insert_data.sort(key = itemgetter(0,1)) # sort by modified to ensure the latest goes into database
                insert_data = list(unique_everseen(_insert_data, key = itemgetter(0,1))) # pick the unique org/id combinations
                if self.debug: print(f"Inserting {len(items[table])} items into {table}")
                query = INSERT_QUERY.replace('**TABLE**', table)
                ret[table] = self.bulkInserter(query, insert_data)

        return ret

    def insertLog(self, session, type, log):
        #TODO query in config
        query = LOG_QUERY
        res = self.query(query, (str(session), type, json.dumps(log)))
        return res

    def getURLs(self, session):
        res = self.query(URLS_QUERY, ( str(session), ) )[0] # note , to keep as tuple not string
        return res[0]

    def deleteOldRecords(self, table):
        if self.debug: print(f"Deleting from {table}")
        query = DELETE_QUERY.replace('**TABLE**', table)
        res = self.query(query)
        return res

    def countRecords(self,table):
        query =  COUNT_QUERY.replace('**TABLE**', table)
        if self.debug: print(f"Counting {table}")
        res = self.query(query)
        return res[0]
