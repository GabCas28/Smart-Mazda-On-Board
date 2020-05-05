import time
from flask import Flask
import random
import database

table = database.getDataBase(time.strftime('%d-%m-%Y_%H:%M:%S'))

app = Flask(__name__)
@app.route('/time')
def get_current_time():
    return {
        'time': time.strftime('%A %B, %d %Y %H:%M:%S'),
    }

@app.route('/streamData')
def get_current_data():
    return {
        'speed': random.randrange(70, 150, 1),
        'rpm': random.randrange(0, 100000,100),
        'engineLoad': random.randrange(0, 100),
    }


@app.route('/processedData')
def get_processed_data():
    database.updateTrip(table, time.strftime('%H:%M:%S'), random.randrange(0, 150), random.randrange(0, 100000,100), random.randrange(0, 100), random.randrange(0, 100), random.randrange(40, 120))
    return {
        'speed': random.randrange(0, 150),
        'rpm': random.randrange(0, 100000,100),
        'engineLoad': random.randrange(0, 100),
    }

