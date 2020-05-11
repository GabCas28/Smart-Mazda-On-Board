import time
from flask import Flask
import random
from chunk import Chunk
from trip import Trip
from TripDB import TripDB
from OBDConnection import OBDConnection

database = TripDB()
trip = Trip()
chunk = Chunk()
obdConnection = OBDConnection()

def initializeData():
    global chunk, trip, database

    database = TripDB()
    chunk = Chunk()
    trip = Trip()
    obdConnection = OBDConnection()


app = Flask(__name__)
@app.route('/start')
def start_trip():
    initializeData()


@app.route('/time')
def get_current_time():
    return {
        'time': time.strftime('%A %B, %d %Y %H:%M:%S'),
    }


@app.route('/streamData')
def getCurrentData():
    global chunk

    current_data = obdConnection.getCurrentData()
    chunk.update(current_data)
    return current_data


@app.route('/processedData')
def getProcessedData():
    trip.update(chunk.getData())
    database.updateTrip(trip.getData())
    chunk.restart()
    return trip.getData()


@app.route('/getTrip')
def getTrip():
    return trip.getData()

@app.route('/upload')
def upload():
    database.upload()
    return "Uploaded to database"

@app.route('/uploadAndDelete')
def uploadAndDelete():
    database.upload()
    database.clear()
    return "Uploaded to database"
