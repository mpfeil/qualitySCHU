'''
Created on 20.03.2013

@author: Matthias Pfeil
'''
import urllib2
import logging
import re
import json
from datetime import datetime, timedelta
import dateutil.tz
import dateutil.parser

xApiKey = "tT0xUa9Yy24qPaZXDgJi-lDmf3iSAKxvMEhJWDBleHpMWT0g"

def getAQEFromSos():
    aqe = []
    request = urllib2.urlopen("http://giv-geosoft2d.uni-muenster.de/istsos/wa/istsos/services/cosm/procedures/operations/getlist").read()
    
    decoded_data = json.loads(request)
    #print decoded_data
    for data in decoded_data["data"]:
        tmp = []
        tmp.append(data["name"])
        tmp.append(data["assignedid"])
        aqe.append(tmp)
        
    getDatapointsFromCOSM(aqe)

def getDatapointsFromCOSM(aqe):
    print aqe
    'Build correct timezone offset'
    localtz = dateutil.tz.tzlocal()
    localoffset = localtz.utcoffset(datetime.now())
    localoffset_in_hours = (localoffset.days * 86400 + localoffset.seconds) / 3600
    if localoffset_in_hours >= 0:
        if localoffset_in_hours > 10:
            localoffset_in_hours = "+"+str(localoffset_in_hours)
        else:
            localoffset_in_hours = "+0"+str(localoffset_in_hours)
    if localoffset_in_hours < 0:
        if localoffset_in_hours > 10:
            localoffset_in_hours = "-"+str(localoffset_in_hours)
        else:
            localoffset_in_hours = "-0"+str(localoffset_in_hours)
    
    print datetime.now()
    
    for i in range(len(aqe)):
        search_for = str(aqe[i][0])
        try:
            cosm = urllib2.urlopen("http://api.cosm.com/v2/feeds/"+search_for+".json?key="+xApiKey+"&timezone="+localoffset_in_hours).read()
            cosmJSON = json.loads(cosm)
            last_update = cosmJSON["updated"];
            yourdate = dateutil.parser.parse(last_update)
            endtime = '{:%Y-%m-%dT%H:%M:00}'.format(yourdate)
            one_hour_from_now = yourdate - timedelta(minutes=15)
            starttime = '{:%Y-%m-%dT%H:%M:00}'.format(one_hour_from_now)
            response = urllib2.urlopen("http://api.cosm.com/v2/feeds/"+search_for+".json?start="+starttime+"&end="+endtime+"&timezone="+localoffset_in_hours+"&interval=60&interval_type=discrete&find_previous=true&key="+xApiKey).read()
            history = json.loads(response)
            datastreams = history["datastreams"]
            for j in range(len(datastreams)):
                for i in range(len(datastreams[j]["tags"])):
                    insert = []
                    if datastreams[j]["tags"][i] == "aqe:data_origin=computed":
                        values = ""
                        for datapoint in datastreams[j]["datapoints"]:
                            if values == "":
                                values = datapoint["at"] + "," + datapoint["value"]
                            else:
                                values = values + "@" + datapoint["at"] + "," + datapoint["value"]
                        insert.append(datastreams[j]["tags"][len(datastreams[j]["tags"])-1])
                        insert.append(values)
                        insertAQEDataToSOS(insert,aqe)
        except KeyError as kE:
            print kE
            #print "Error:"+str(kE)+" not found for "+str(datastreams[j])
    print datetime.now()
        #print datastream[0]["datapoints"]
        #print datastream[0]["datapoints"][0]
        #for datastream in decoded_datapoints["datastreams"]:
        #    print datastream["datapoints"]

def insertAQEDataToSOS(inserts,aqes):
    print inserts

if __name__ == '__main__':
    getAQEFromSos()