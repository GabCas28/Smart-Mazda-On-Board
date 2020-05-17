import time
from flask import Flask, Response
import random
from chunk import Chunk
from trip import Trip
from TripDB import TripDB
from OBDConnection import OBDConnection as connect

import os
import sys
import time 
import subprocess
from flask import Flask, request, jsonify
from multiprocessing import Process, Queue

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
    pass


@app.route('/time')
def get_current_time():
    return {
        'time': time.strftime('%A %B, %d %Y %H:%M:%S'),
    }


    
@app.route('/stream')
def getStream():
    def generate():
        while obdConnection.getCurrentData():
            chunk.update(obdConnection.getCurrentData())
            time.sleep(0.4)
            yield str(obdConnection.getCurrentData())+"\n"
    return Response(generate(), mimetype='application/json')

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
    return database.upload()

@app.route('/clear')
def clear():
    database.clear()
    return {'OK': "Cleared previous trips from local database"}

@app.route('/connectOBD')
def connectOBD():
    global obdConnection
    if obdConnection:
        return {'OBD':"ALREADY CONNECTED"} 
    else: 
        try:
            obdConnection =["something"]
            obdConnection = connect()
            return {"OBD": "CONNECTED"}

        except:
            obdConnection = None
            print("Something went wrong")

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

some_queue = None

@app.route('/restart')
def restart():
    some_queue.put("something")
    return {"OK":"Quit"}

def start_flaskapp(queue):
    global some_queue
    some_queue = queue
    initializeData()
    app.run(debug=True, use_reloader=False)

if __name__ == '__main__':
    # app.run(debug=True, use_reloader=False)
    q = Queue()
    p = Process(target=start_flaskapp, args=[q,])
    p.start()
    while True: #wathing queue, sleep if there is no call, otherwise break
        if q.empty(): 
                time.sleep(1)
        else:
            break
    p.terminate() #terminate flaskapp and then restart the app on subprocess
    args = [sys.executable] + [sys.argv[0]]
    subprocess.call(args)
