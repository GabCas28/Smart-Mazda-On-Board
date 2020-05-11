import random

class OBDConnection:

    def __init__(self):
        pass

    def getCurrentData(self):
        return {
            'speed': self.getSpeed(),
            'rpm': self.getRPM(),
            'engineLoad': self.getEngineLoad(),
            'coolantTemp': self.getCoolantTemperature(),
            'throttlePos': self.getThrottlePosition()
        }
    def getSpeed(self):
        return random.randrange(0, 150)


    def getRPM(self):
        return random.randrange(0, 8000, 100)


    def getEngineLoad(self):
        return random.randrange(0, 100)


    def getThrottlePosition(self):
        return random.randrange(0, 100)


    def getCoolantTemperature(self):
        return random.randrange(0, 100)
