import time
from flask import Flask
import random
import obd

ports = obd.scan_serial()
print(ports)
connection = obd.OBD(ports[3])
print("conn attempt done")


def getspeed():
    spd = connection.query(obd.commands.SPEED)
    if not spd.is_null():
        return(spd.value.magnitude)
    else:
        return 0


def getrpm():
    rpms = connection.query(obd.commands.RPM)
    if not rpms.is_null():
        return(round(rpms.value.magnitude))
    else:
        return 0


def getthrottle():
    throttle = connection.query(obd.commands.THROTTLE_POS)
    if not throttle.is_null():
        return(round(throttle.value.magnitude))
    else:
        return 0


def gettemp():
    temperature = connection.query(obd.commands.COOLANT_TEMP)
    if not temperature.is_null():
        return(round(temperature.value.magnitude))
    else:
        return 0


app = Flask(__name__)
@app.route('/start')
def main():
    pass
    # Call OBD
    # Connection to OBD
    # Local database
    # Initial data for the trip

    # Test comment by Johan


@app.route('/time')
def get_current_time():
    return {
        'time': time.strftime('%A %B, %d %Y %H:%M:%S'),
    }


@app.route('/streamData')
def get_current_data():
    return {
        'speed': getspeed(),
        'rpm': getrpm(),
        'engineLoad': random.randrange(0, 100),
        'throttle': getthrottle(),
        'temperature': gettemp(),
    }


@app.route('/processedData')
def get_processed_data():
    return {
        'speed': random.randrange(0, 150),
<<<<<<< Updated upstream
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
=======
        'rpm': random.randrange(0, 100000, 100),
        'engineLoad': random.randrange(0, 100),
    }
>>>>>>> Stashed changes
