import time
from flask import Flask
import random
import database

# Makes a new table in the DB that is called the current date and time
table = database.getDataBase(time.strftime('%d-%m-%Y_%H:%M:%S'))

trip = {}
chunk = {}


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


def initializeTrip():
    global trip
    trip = {
        'startTime': time.strftime('%A %B, %d %Y %H:%M:%S'),
        'steps': 0,
        'duration': 0,
        'time': [],
        'coolantTemperature': [],
        'throttlePosition': [],
        'speed': [],
        'rpm': [],
        'engineLoad': [],
    }


def initializeChunk():
    global chunk
    chunk = {
        'startTime': time.time(),
        'steps': 0,
        'endTime': 0,
        'duration': 0,
        'coolantTemperature': 0,
        'throttlePosition': 0,
        'speed': 0,
        'rpm': 0,
        'engineLoad': 0,
    }


def updateTrip():
    global trip
    trip['duration'] = trip['duration'] + chunk["duration"]
    trip['time'].append(time.time())
    trip['speed'].append(chunk["speed"]/chunk["steps"])
    trip['rpm'].append(chunk["rpm"]/chunk["steps"])
    trip['engineLoad'].append(chunk["engineLoad"]/chunk["steps"])
    trip['coolantTemperature'].append(
        chunk["coolantTemperature"]/chunk["steps"])
    trip['throttlePosition'].append(chunk["throttlePosition"]/chunk["steps"])
    trip["steps"] = trip["steps"] + 1


def updateChunk():
    global chunk
    chunk['duration'] = trip['duration'] + time.time() - chunk['endTime']
    chunk['endTime'] = time.time()
    chunk['speed'] = chunk['speed'] + getSpeed()
    chunk['rpm'] = chunk['rpm'] + getRPM()
    chunk['engineLoad'] = chunk['engineLoad'] + getEngineLoad()
    chunk['coolantTemperature'] = chunk['coolantTemperature'] + \
        getCoolantTemperature()
    chunk['throttlePosition'] = chunk['throttlePosition'] + getThrottlePosition()
    chunk["steps"] = chunk["steps"] + 1


def initializeData():
    initializeTrip()
    initializeChunk()


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
def get_current_data():
    updateChunk()
    return {
        'speed': getSpeed(),
        'rpm': getRPM(),
        'engineLoad': getEngineLoad(),
        'coolantTemperature': getCoolantTemperature(),
        'throttlePosition': getThrottlePosition()
    }


@app.route('/processedData')
def get_processed_data():
    # Updates the trip table every time this function is called
    database.updateTrip(table, time.strftime('%H:%M:%S'), random.randrange(0, 150), random.randrange(0, 100000,100), random.randrange(0, 100), random.randrange(0, 100), random.randrange(40, 120))
    updateTrip()
    initializeChunk()
    return trip
