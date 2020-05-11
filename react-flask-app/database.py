from tinydb import TinyDB, Query
import json
from pymongo import MongoClient
from bson import json_util

# Checks if there already is a database called "Trips.json" if yes, it uses that, else it creates it
# Creates a table which has the current time and date as a name to identify the different trips
def getDataBase(time):
    # name = time + ".json"
    db = TinyDB("Trips.json")
    table = db.table(time)
    return table, db

# Enters the data into the table of the current trip
def updateTrip(table, DBentry):   
    table.insert(DBentry)

def readJsonIntoMongo():
    client = MongoClient("mongodb+srv://mazda:V2KMvmtixGkOxq2h@cluster0-lpt2w.gcp.mongodb.net/test?retryWrites=true&w=majority")
    mDB = client.MazdaDB
    colleciton = mDB.Testing

    f = open("Trips.json")
    file_data = json.load(f)
    print("Before insert")
    colleciton.insert_one(file_data)
    print("After insert")
