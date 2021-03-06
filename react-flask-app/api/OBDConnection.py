import random
from obd import scan_serial, Async, commands

class OBDConnection:
    ports = None
    connection = None

    def __init__(self):
        self.ports = self.getPorts()
        self.getConnection()
    
    def getPorts(self):
        ports = scan_serial()
        print(ports)
        return ports

    def getConnection(self, port_n=0):
        if self.connection:
            return self.connection
        else:
            if len(self.ports) > 0:
                print("conn attempt done")
                if port_n < len(self.ports):
                    print("connecting to port " + self.ports[port_n] )
                    self.connection=Async(self.ports[port_n])#,baudrate=115200, delay_cmds=0)
                    self.connection.watch(commands['SPEED']) # keep track of the RPM
                    self.connection.watch(commands['RPM']) # keep track of the RPM
                    self.connection.watch(commands['ENGINE_LOAD']) # keep track of the RPM
                    self.connection.watch(commands['THROTTLE_POS']) # keep track of the RPM
                    self.connection.watch(commands['COOLANT_TEMP']) # keep track of the RPM
                    self.connection.start()
                    return self.connection
                else:
                    self.connection=Async(baudrate=115200, delay_cmds=0)
                    self.connection.watch(commands['SPEED']) # keep track of the RPM
                    self.connection.watch(commands['RPM']) # keep track of the RPM
                    self.connection.watch(commands['ENGINE_LOAD']) # keep track of the RPM
                    self.connection.watch(commands['THROTTLE_POS']) # keep track of the RPM
                    self.connection.watch(commands['COOLANT_TEMP']) # keep track of the RPM
                    self.connection.start()  
                    return self.connection
            else:
                print("Unable to connect")
                return None

    def closeConnection(self, port_n=0):
        if self.connection:
            return self.connection.close()

    def getCurrentData(self):
        return {
            'speed': round(self.getSpeed(),2),
            'rpm': round(self.getRPM(),0),
            'engineLoad': round(self.getEngineLoad(),2),
            'coolantTemp': self.getCoolantTemp(),
            'throttlePos': round(self.getThrottlePos(),2)
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
            return random.randrange(0,15000)


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
