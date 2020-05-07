import time


class Chunk:
    speed = 0
    coolantTemp=0
    rpm=0
    throttlePos=0 
    engineLoad=0
    steps=0
    startTime=""
    def __init(self):
        self.startTime: time.time()
        self.steps: 0
        self.coolantTemp: 0
        self.throttlePos: 0
        self.speed: 0
        self.rpm: 0
        self.engineLoad: 0

    def update(self, data):
        self.updateSpeed(data['speed'])
        self.updateRPM(data['rpm'])
        self.updateThrottlePos(data['throttlePos'])
        self.updateEngineLoad(data['engineLoad'])
        self.updateCoolantTemp(data['coolantTemp'])
        self.incrementSteps()

    def getData(self):
        return{
            'speed': self.speed,
            'rpm': self.rpm,
            'engineLoad': self.engineLoad,
            'coolantTemp': self.coolantTemp,
            'throttlePos': self.throttlePos,
            'startTime': self.startTime,
            'steps': self.steps
        }   

    def updateSpeed(self, speed):
        self.speed = round((self.speed * self.steps + speed) / (self.steps+1),2)

    def updateRPM(self, rpm):
        self.rpm = round((self.rpm * self.steps + rpm) / (self.steps+1),2)

    def updateEngineLoad(self, engineLoad):
        self.engineLoad = round((self.engineLoad * self.steps +
                           engineLoad) / (self.steps+1),2)

    def updateCoolantTemp(self, coolantTemp):
        self.coolantTemp = round((self.coolantTemp * self.steps +
                            coolantTemp) / (self.steps+1),2)

    def updateThrottlePos(self, throttlePos):
        self.throttlePos = round((self.throttlePos * self.steps +
                            throttlePos) / (self.steps+1),2)

    def incrementSteps(self):
        self.steps = self.steps+1
