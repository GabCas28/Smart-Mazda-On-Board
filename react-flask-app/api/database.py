from tinydb import TinyDB, Query

# Checks if there already is a database called "Trips.json" if yes, it uses that, else it creates it
# Creates a table which has the current time and date as a name to identify the different trips
def getDataBase(time):
    # name = time + ".json"
    db = TinyDB("Trips.json")
    table = db.table(time)
    return table

# Enters the data into the table of the current trip
def updateTrip(table, time, speed, RPM, throttlePos, engineLoad, coolantTemp):
    table.insert({"Time": time, "Speed": speed, "RPM": RPM, "Throttle position": throttlePos, "Engine load": engineLoad, "Coolant temp": coolantTemp})
