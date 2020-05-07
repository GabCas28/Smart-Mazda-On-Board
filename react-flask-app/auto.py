import obd
import time
#obd.logger.setLevel(obd.logging.DEBUG) # enables all debug information
ports = obd.scan_serial()      # return list of valid USB or RF ports
print(ports)                   # ['/dev/ttyUSB0', '/dev/ttyUSB1']
connection = obd.OBD(ports[3])
cmd = obd.commands.SPEED
revs = obd.commands.RPM
while True:
    response = connection.query(cmd)
    resp2 = connection.query(revs)
    time.sleep(1)
    print(response.value)
    print(resp2.value)
