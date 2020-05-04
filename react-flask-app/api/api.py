import time
from flask import Flask
import random

app = Flask(__name__)
@app.route('/start')
def main():
    pass
    # Call OBD
    # Connection to OBD
    # Local database
    # Initial data for the trip


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
    return {
        'speed': random.randrange(0, 150),
        'rpm': random.randrange(0, 100000,100),
        'engineLoad': random.randrange(0, 100)
    }


# {
#     'startDate':  date and time of start of the trip
    
#     'speed':[
#         s1,s2,s3,... 
#     ],
#     'rpm':[
#         r1,r2,r3,...
#     ],
#     'engineLoad':[
#         e1,e2,e3,...
#     ]
# }