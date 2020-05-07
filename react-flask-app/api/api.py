import time
from flask import Flask
import random
from chunk import Chunk 
from trip import Trip
import database

# Makes a new table in the DB that is called the current date and time
table, db = database.getDataBase(time.strftime('%d-%m-%Y_%H:%M:%S'))
trip = Trip()
chunk = Chunk()


def getSpeed():
    return random.randrange(0, 150)


def getRPM():
    return random.randrange(0, 100000, 100)


def getEngineLoad():
    return random.randrange(0, 100)


def getThrottlePosition():
    return random.randrange(0, 100)


def getCoolantTemperature():
    return random.randrange(0, 100)


def initializeData():
    global chunk, trip
    
    chunk = Chunk()
    trip = Trip()


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
    current_data = {
        'speed': getSpeed(),
        'rpm': getRPM(),
        'engineLoad': getEngineLoad(),
        'coolantTemp': getCoolantTemperature(),
        'throttlePos': getThrottlePosition()
    }
    chunk.update(current_data)
    return current_data


@app.route('/processedData')
def getProcessedData():
    global trip, chunk
    processed_data = chunk.getData()
    trip.update(processed_data)
    database.updateTrip(table, trip.getData())
    chunk = Chunk()
    return trip.getData()


@app.route('/getTrip')
def getTrip():
    global trip
    processed_data = trip.getData()    
    return processed_data
