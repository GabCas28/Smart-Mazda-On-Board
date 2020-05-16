from tinydb import TinyDB, Query, where
from tinydb.operations import delete, add, set
# import json
from pymongo import MongoClient, ReplaceOne
from bson import json_util, objectid
from pymongo.errors import BulkWriteError
import time
import pprint
class TripDB:
    database = None
    def __init__(self):
        self.database = self.getDataBase()

    def getDataBase(self):
        """ Retrieves the content of the database, it creates a new one if it doesn't exist """
        db = TinyDB("Trips.json")
        return db

    def updateTrip(self, DBentry):  
        """ Insert or Update new entry into the table """
        self.database.upsert(DBentry, Query().startTime==DBentry['startTime'])

    def upload(self):
        """ Upload the content of the database to the remote server """
        client = MongoClient("mongodb+srv://mazda:V2KMvmtixGkOxq2h@cluster0-lpt2w.gcp.mongodb.net/test?retryWrites=true&w=majority")
        remoteDB = client.SmartMazda.trips
        operations = [ReplaceOne(
            filter={"startTime": doc["startTime"]}, 
            replacement=doc,
            upsert=True
            ) for doc in self.database.all()]
        try:
            result = remoteDB.bulk_write(operations)
        except BulkWriteError as bwe:
            print(bwe.details)

        return (json_util.dumps(result.bulk_api_result))

    def clear(self):
        """ Delete the content of the local database """
        self.database.truncate()