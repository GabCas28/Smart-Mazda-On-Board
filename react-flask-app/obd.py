import obd
import time

def scanDevices():
    """ Scan for connected ports """
    return obd.scan_serial()


def connectToPort(portNumber=0):
    """ Connect to selected port, by default port 0"""

    ports = scanDevices()

    if (obd.OBD(ports[portNumber])):
        return obd.OBD(ports[portNumber])
    else:
        raise Exception("Unable to connect to port " + portNumber)


def main():

    connection = connectToPort()

    for command in obd.commands[1]:
        response = connection.query(command)
        if not response.is_null():
            print(response.command.name)
            print(response.value)


main()
