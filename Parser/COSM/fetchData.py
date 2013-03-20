'''
Created on 20.03.2013

@author: Matthias Pfeil
'''
import urllib2
import logging
import re
import json

def getAQEFromSos():
    request = urllib2.urlopen("http://giv-geosoft2d.uni-muenster.de/istsos/wa/istsos/services/cosmtest/procedures/operations/getlist").read()
    
    decoded_data = json.loads(request)
    print decoded_data
    for data in decoded_data["data"]:
        print data["name"]

def getDatapointsFromCOSM():
    print "asdf"

if __name__ == '__main__':
    getAQEFromSos()