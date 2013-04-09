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
    request = urllib2.urlopen("http://giv-geosoft2d.uni-muenster.de/istsos/wa/istsos/services/cosmcosm/procedures/operations/getlist").read()
    
    decoded_data = json.loads(request)
    
    for data in decoded_data["data"]:
        tmp = []
        tmp.append(data["name"])
        tmp.append(data["assignedid"])
        aqe.append(tmp)
        
    getDatapointsFromCOSM(aqe)

def getDatapointsFromCOSM(aqe):
    #print aqe
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
    
    print '{:%Y-%m-%dT%H:%M:00}'.format(datetime.now())
    
    endtime = '{:%Y-%m-%dT%H:%M:00}'.format(datetime.now())
    one_hour_from_now = dateutil.parser.parse(endtime) - timedelta(minutes=14)
    starttime = '{:%Y-%m-%dT%H:%M:00}'.format(one_hour_from_now)
    
    for i in range(len(aqe)):
        search_for = str(aqe[i][0])
        #print search_for
        try:
            response = urllib2.urlopen("http://api.cosm.com/v2/feeds/"+search_for+".json?start="+starttime+"&end="+endtime+"&timezone="+localoffset_in_hours+"&interval=60&interval_type=discrete&find_previous=true&key="+xApiKey).read()
            history = json.loads(response)
            datastreams = history["datastreams"]
            
            aqes = []
            aqes.append(aqe[i][0])
            aqes.append(aqe[i][1])
            insert = []
            for j in range(len(datastreams)):
                #print datastreams[j]
                for i in range(len(datastreams[j]["tags"])):
                    datapoints = []
                    if datastreams[j]["tags"][i] == "aqe:data_origin=computed":
                        if datastreams[j]["tags"][len(datastreams[j]["tags"])-1] == "aqe:sensor_type=CO":
                            datapoints = datastreams[j]["datapoints"]
                            insert.append(datastreams[j]["tags"][len(datastreams[j]["tags"])-1])
                        if datastreams[j]["tags"][len(datastreams[j]["tags"])-1] == "aqe:sensor_type=Humidity":
                            datapoints = datastreams[j]["datapoints"]
                            insert.append(datastreams[j]["tags"][len(datastreams[j]["tags"])-1])
                        if datastreams[j]["tags"][len(datastreams[j]["tags"])-1] == "aqe:sensor_type=NO2":
                            datapoints = datastreams[j]["datapoints"]
                            insert.append(datastreams[j]["tags"][len(datastreams[j]["tags"])-1])
                        if datastreams[j]["tags"][len(datastreams[j]["tags"])-1] == "aqe:sensor_type=Temperature":
                            datapoints = datastreams[j]["datapoints"]
                            insert.append(datastreams[j]["tags"][len(datastreams[j]["tags"])-1])
                        values = ""
                        #print datapoints
                        if datapoints != []:
                            for datapoint in datapoints:
                                if values == "":
                                    values = datapoint["at"] + "," + datapoint["value"]
                                else:
                                    values = values + "@" + datapoint["at"] + "," + datapoint["value"]
                            insert.append(values)
                        #else:
                        #    print "FALSE"
                        
                        #print values
                        
                        #for datapoint in datapoints:
                        #for datapoint in datastreams[j]["datapoints"]:
                        #    if values == "":
                        #        values = datapoint["at"] + "," + datapoint["value"]
                        #    else:
                        #        values = values + "@" + datapoint["at"] + "," + datapoint["value"]
                        #insert.append(datastreams[j]["tags"][len(datastreams[j]["tags"])-1])
                        #insert.append(values)
            #print insert
            insertAQEDataToSOS(insert,aqes,starttime,endtime)
            print "new egg"
        except KeyError as kE:
            print kE
            #print "Error:"+str(kE)+" not found for "+str(datastreams[j])
    print datetime.now()
        #print datastream[0]["datapoints"]
        #print datastream[0]["datapoints"][0]
        #for datastream in decoded_datapoints["datastreams"]:
        #    print datastream["datapoints"]

def insertAQEDataToSOS(inserts,aqe,start,end):
    count = 1
    valuesToInsert = ""
    values = []
    print aqe
    #print len(inserts)
    print inserts
    while (count <= len(inserts)):
        values.append(inserts[count].split("@"))
        count = count + 2
    #print values
    #print len(values)
    #i = 0
    #j = 0
    try:
        #print len(values)
        #for i in range(len(values)):
        #    print len(values[i])
        for j in range(len(values[0])):
            #print values[i][j]
            count2 = 0
            while (count2 < len(values)):
                if valuesToInsert == "":
                    valuesToInsert = values[count2][j].split(",")[0]+","+str(float(values[count2][j].split(",")[1])/1000)
                else:
                    if count2 == 0:
                        valuesToInsert = valuesToInsert +"@"+ values[count2][j].split(",")[0]+","+str(float(values[count2][j].split(",")[1])/1000)
                    elif count2 == 2:
                        valuesToInsert = valuesToInsert +","+str(float(values[count2][j].split(",")[1])/1000)
                    else:    
                        valuesToInsert = valuesToInsert +","+ values[count2][j].split(",")[1]
                #print values[count2][j]
                count2 = count2 + 1
        print valuesToInsert
    except IndexError as iE:
        print iE
    
    start = start+"+02:00"
    end = end+"+02:00"
    
    three_hours_from_now = datetime.now() + timedelta(hours=3)
    endtime = '{:%Y-%m-%dT%H:30:00+02}'.format(three_hours_from_now)
    
    #print endtime
    
    insert_Observation = '<?xml version="1.0" encoding="UTF-8"?>\n\
<sos:InsertObservation\n\
   xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n\
   xsi:schemaLocation="http://schemas.opengis.net/sos/1.0.0/sosAll.xsd"\n\
   xmlns:sos="http://www.opengis.net/sos/1.0"\n\
   xmlns:xlink="http://www.w3.org/1999/xlink"\n\
   xmlns:sa="http://www.opengis.net/sampling/1.0"\n\
   xmlns:swe="http://www.opengis.net/swe/1.0.1"\n\
   xmlns:gml="http://www.opengis.net/gml/3.2"\n\
   xmlns:ogc="http://www.opengis.net/ogc"\n\
   xmlns:om="http://www.opengis.net/om/1.0" service="SOS" version="1.0.0" >\n\
   <sos:AssignedSensorId>'+aqe[1]+'</sos:AssignedSensorId>\n\
   <om:Observation>\n\
    <om:procedure xlink:href="urn:ogc:def:procedure:x-istsos:1.0:'+aqe[0]+'"/>\n\
    <om:samplingTime>\n\
      <gml:TimePeriod>\n\
        <gml:beginPosition>'+start+'</gml:beginPosition>\n\
        <gml:endPosition>'+endtime+'</gml:endPosition>\n\
      </gml:TimePeriod>\n\
    </om:samplingTime>\n\
    <om:observedProperty xlink:href="">\n\
      <swe:CompositPhenomenon dimension="5">\n\
        <swe:component xlink:href="urn:ogc:def:parameter:x-istsos:1.0:time:iso8601"/>\n\
        <swe:component xlink:href="urn:ogc:def:parameter:x-istsos:1.0:meteo:air:co" />\n\
        <swe:component xlink:href="urn:ogc:def:parameter:x-istsos:1.0:meteo:air:humidity" />\n\
        <swe:component xlink:href="urn:ogc:def:parameter:x-istsos:1.0:meteo:air:no2" />\n\
        <swe:component xlink:href="urn:ogc:def:parameter:x-istsos:1.0:meteo:air:temperature" />\n\
      </swe:CompositPhenomenon>\n\
    </om:observedProperty>\n\
    <om:featureOfInterest xlink:href="urn:ogc:def:feature:x-istsos:1.0:Point:'+aqe[0]+'"/>\n\
      <om:result>\n\
        <swe:DataArray>\n\
          <swe:elementCount>\n\
            <swe:Count>\n\
              <swe:value>5</swe:value>\n\
            </swe:Count>\n\
          </swe:elementCount>\n\
          <swe:elementType name="SimpleDataArray">\n\
              <swe:DataRecord definition="http://mmiws.org/ont/x/timeSeries">\n\
                <swe:field name="Time">\n\
                  <swe:Time definition="urn:ogc:def:parameter:x-istsos:1.0:time:iso8601"/>\n\
                </swe:field>\n\
                <swe:field name="co">\n\
                  <swe:Quantity definition="urn:ogc:def:parameter:x-istsos:1.0:meteo:air:co">\n\
                    <swe:uom code="ppm"/>\n\
                  </swe:Quantity>\n\
                </swe:field>\n\
                <swe:field name="humidity">\n\
                  <swe:Quantity definition="urn:ogc:def:parameter:x-istsos:1.0:meteo:air:humidity">\n\
                    <swe:uom code="%"/>\n\
                  </swe:Quantity>\n\
                </swe:field>\n\
                <swe:field name="nitrogen dioxide">\n\
                  <swe:Quantity definition="urn:ogc:def:parameter:x-istsos:1.0:meteo:air:no2">\n\
                    <swe:uom code="ppm"/>\n\
                  </swe:Quantity>\n\
                </swe:field>\n\
                <swe:field name="temperature">\n\
                  <swe:Quantity definition="urn:ogc:def:parameter:x-istsos:1.0:meteo:air:temperature">\n\
                    <swe:uom code="deg C"/>\n\
                  </swe:Quantity>\n\
                </swe:field>\n\
              </swe:DataRecord>\n\
          </swe:elementType>\n\
        <swe:encoding>\n\
          <swe:TextBlock tokenSeparator="," blockSeparator="@" decimalSeparator="."/>\n\
        </swe:encoding>\n\
        <swe:values>'+valuesToInsert+'</swe:values>\n\
      </swe:DataArray>\n\
    </om:result>\n\
  </om:Observation>\n\
</sos:InsertObservation>'

    #print insert_Observation
    headers = {"Content-type": "application/raw", "Accept": "text/plain"}
    request = urllib2.Request("http://giv-geosoft2d.uni-muenster.de/istsos/cosmcosm",insert_Observation,headers)
    handler = urllib2.urlopen(request)
    print handler.read()
    
    
if __name__ == '__main__':
    getAQEFromSos()