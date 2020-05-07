import time


class Trip:
    startTime = time.strftime('%A %B, %d %Y %H:%M:%S')
    nSnaps = 0
    tripDuration = 0
    avSpeed = 0
    avRPM = 0
    avEngineLoad = 0
    avCoolantTemp = 0
    avThrottlePos = 0
    snaps = []

    def __init__(self):
        self.startTime = time.strftime('%A %B, %d %Y %H:%M:%S')
        self.nSnaps = 0
        self.tripDuration = 0
        self.avSpeed = 0
        self.avRPM = 0
        self.avEngineLoad = 0
        self.avCoolantTemp = 0
        self.avThrottlePos = 0
        self.snaps = []

    def update(self, chunk):
        self.updateSpeed(chunk.speed)
        self.updateRPM(chunk.rpm)
        self.updateThrottlePos(chunk.throttlePos)
        self.updateEngineLoad(chunk.engineLoad)
        self.updateCoolantTemp(chunk.coolantTemp)
        self.addSnap(chunk)
        self.incrementSnaps()

    def getData(self):
        return{
            'avSpeed': self.avSpeed,
            'avRPM': self.avRPM,
            'avEngineLoad': self.avEngineLoad,
            'avCoolantTemp': self.avCoolantTemp,
            'avThrottlePos': self.avThrottlePos,
            'startTime': self.startTime,
            'nSnaps': self.nSnaps,
            'snaps': self.snaps
        }

    def updateDuration(self, duration):
        pass

    def addSnap(self, chunk):
        self.snaps.append(chunk)

    def updateSpeed(self, speed):
        self.avSpeed = round(
            ((self.avSpeed * self.nSnaps) + speed) / (self.nSnaps+1), 2)

    def updateRPM(self, rpm):
        self.avRPM = round(
            (self.avRPM * self.nSnaps + rpm) / (self.nSnaps+1), 0)

    def updateEngineLoad(self, engineLoad):
        self.avEngineLoad = round((self.avEngineLoad * self.nSnaps +
                                   engineLoad) / (self.nSnaps+1), 2)

    def updateCoolantTemp(self, coolantTemp):
        self.avCoolantTemp = round((self.avCoolantTemp * self.nSnaps +
                                    coolantTemp) / (self.nSnaps+1), 2)

    def updateThrottlePos(self, throttlePos):
        self.avThrottlePos = round((self.avThrottlePos * self.nSnaps +
                                    throttlePos) / (self.nSnaps+1), 2)

    def incrementSnaps(self):
        self.nSnaps = self.nSnaps+1
