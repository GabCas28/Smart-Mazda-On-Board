from tinydb import TinyDB, Query

# Sets up database



def getDataBase(time):
    # name = time + ".json"
    db = TinyDB("Trips.json")
    table = db.table(time)
    return table

def updateTrip(table, time, speed, RPM, throttlePos, engineLoad, coolantTemp):

    table.insert({"Time": time, "Speed": speed, "RPM": RPM, "Throttle position": throttlePos, "Engine load": engineLoad, "Coolant temp": coolantTemp})


