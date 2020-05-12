import time
from flask import Flask, Response
import random
from chunk import Chunk
from trip import Trip
from TripDB import TripDB
from OBDConnection import OBDConnection

database = None
trip = None
chunk = None
obdConnection = None



def initializeData():
    initTrip()
    initChunk()
    initDB()
    connectOBD()


app = Flask(__name__)
@app.route('/start')
def start_trip():
    initializeData()


@app.route('/time')
def get_current_time():
    return {
        'time': time.strftime('%A %B, %d %Y %H:%M:%S'),
    }


    
# @app.route('/streamData')
# def getCurrentData():
#     global chunk
#     def generate():
#         while True:
#             current_data = obdConnection.getCurrentData()   
#             chunk.update(current_data)
#             yield current_data
#     return Response(generate(), mimetype='text/json')
@app.route('/streamData')
def getCurrentData():
    global chunk
    if obdConnection:
        current_data = obdConnection.getCurrentData()
        chunk.update(current_data)
        return current_data
    else:
        return {}

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

@app.route('/connectOBD')
def connectOBD():
    global obdConnection
    if obdConnection:
        return "ALREADY CONNECTED" 
    else: 
        obdConnection = OBDConnection()
        return "OBD CONNECTED"

def initTrip():
    global trip
    if not trip:
        trip=Trip()

def initChunk():
    global chunk
    if not chunk:
        chunk=Chunk()

def initDB():
    global database
    if not database:
        database=TripDB()