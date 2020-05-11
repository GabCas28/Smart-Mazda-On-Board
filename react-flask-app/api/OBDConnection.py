import random
from obd import scan_serial, OBD, commands

class OBDConnection:
    ports = None
    connection = None

    def __init__(self):
        self.ports = self.getPorts()
        self.connection = self.getConnection()
    
    def getPorts(self):
        ports = scan_serial()
        print(ports)
        return ports

    def getConnection(self, port_n=3):
        print("conn attempt done")
        if self.ports:
            if (len(self.ports)<port_n):
                return OBD(self.ports[port_n])
        else:
            return None
    

    def getCurrentData(self):
        return {
            'speed': self.getSpeed(),
            'rpm': self.getRPM(),
            'engineLoad': self.getEngineLoad(),
            'coolantTemp': self.getCoolantTemp(),
            'throttlePos': self.getThrottlePos()
        }

    def getSpeed(self):
        if self.connection:
            query = self.connection.query(commands['SPEED'])
            if query.is_null():
                return 0 
            else:
                return (query.value.magnitude)
        else:
            return random.randrange(0,150)


    def getRPM(self):
        if self.connection:
            query = self.connection.query(commands['RPM'])
            if query.is_null():
                return 0 
            else:
                return (query.value.magnitude)
        else:
            return random.randrange(0,150)


    def getEngineLoad(self):
        if self.connection:
            query = self.connection.query(commands['ENGINE_LOAD'])
            if query.is_null():
                return 0 
            else:
                return (query.value.magnitude)
        else:
            return random.randrange(0, 100)


    def getThrottlePos(self):
        if self.connection:
            query = self.connection.query(commands['THROTTLE_POS'])
            if query.is_null():
                return 0 
            else:
                return (query.value.magnitude)
        else:
            return random.randrange(0, 100)


    def getCoolantTemp(self):
        if self.connection:
            query = self.connection.query(commands['COOLANT_TEMP'])
            if query.is_null():
                return 0 
            else:
                return (query.value.magnitude)
        else:
            return random.randrange(0, 100)
