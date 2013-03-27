'''
Created on 20.03.2013

@author: Matthias Pfeil
'''
import urllib2
import logging
import re
import json
from datetime import datetime, timedelta

xApiKey = "tT0xUa9Yy24qPaZXDgJi-lDmf3iSAKxvMEhJWDBleHpMWT0g"

def getAQEFromSos():
    aqe = []
    request = urllib2.urlopen("http://giv-geosoft2d.uni-muenster.de/istsos/wa/istsos/services/cosm/procedures/operations/getlist").read()
    
    decoded_data = json.loads(request)
    #print decoded_data
    for data in decoded_data["data"]:
        aqe.append(data["name"])
        
    getDatapointsFromCOSM(aqe)

def getDatapointsFromCOSM(aqe):
    
    one_hour_from_now = datetime.now() - timedelta(minutes=15)
    print one_hour_from_now
    starttime = '{:%Y-%m-%dT%H:%M:00}'.format(one_hour_from_now)
    print starttime
    endtime = '{:%Y-%m-%dT%H:%M:00}'.format(datetime.now())
    print endtime
    
    for i in range(len(aqe)):
        try:
            response = urllib2.urlopen("http://api.cosm.com/v2/feeds/"+aqe[i]+".json?start="+starttime+"&end="+endtime+"&timezone=+1&interval=60&interval_type=discrete&find_previous=true&key="+xApiKey).read()
            history = json.loads(response)
            datastreams = history["datastreams"]
            print len(datastreams)
            for j in range(len(datastreams)):
                print datastreams[j]["tags"]
        except KeyError as kE:
            print "Error:"+str(kE)+" not found for "+str(datastreams[j])
        #print datastream[0]["datapoints"]
        #print datastream[0]["datapoints"][0]
        #for datastream in decoded_datapoints["datastreams"]:
        #    print datastream["datapoints"]
if __name__ == '__main__':
    getAQEFromSos()