# -*- coding: utf-8 -*-
# COSM Parser - Institute for Geoinformatics University of Muenster
# Copyright (C) 2013 Matthias Pfeil
#
# This program is free software; you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation; either version 2 of the License.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.

import urllib2
import logging
import json
from datetime import datetime, timedelta
import dateutil.tz
import dateutil.parser
from urllib2 import HTTPError

#Set your COSM API Key
xApiKey = "tT0xUa9Yy24qPaZXDgJi-lDmf3iSAKxvMEhJWDBleHpMWT0g"

#Logger settings. You can change the logging file and 
#the formatter.
logger = logging.getLogger('COSM')
hdlr = logging.FileHandler('/var/www/logs/cosmfetchData.log')
formatter = logging.Formatter('%(asctime)s: %(levelname)s %(message)s')
hdlr.setFormatter(formatter)
logger.addHandler(hdlr)
logger.setLevel(logging.INFO)

#This method gets all registered and available AQEs of the SOS
def getAQEFromSos():
    aqe = []
    request = urllib2.urlopen("http://giv-geosoft2d.uni-muenster.de/istsos/wa/istsos/services/cosmcosm/procedures/operations/getlist").read()  
    decoded_data = json.loads(request)
    
    #Build array with name and assignedid
    for data in decoded_data["data"]:
        tmp = []
        tmp.append(data["name"])
        tmp.append(data["assignedid"])
        aqe.append(tmp)
    
    #Call method to get the corresponding data from COSM
    getDatapointsFromCOSM(aqe)

#This method gets the new data from COSM
#and inserts the data to the SOS
def getDatapointsFromCOSM(aqe):
    #Build correct timezone offset to parse the data in the correct time format
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
    
    #Set endtime and starttime for parsing the data from COSM.
    #You can set and change the timedelta. Default is set to 14 minutes.
    #14 Minutes queries data for 15 minutes. See parameter
    #find_previous=true (https://cosm.com/docs/v2/history.html) in the response query.
    endtime = '{:%Y-%m-%dT%H:%M:00}'.format(datetime.now())
    delta = dateutil.parser.parse(endtime) - timedelta(minutes=14)
    starttime = '{:%Y-%m-%dT%H:%M:00}'.format(delta)
    
    for i in range(len(aqe)):
        search_for = str(aqe[i][0])
        try:
            #Query string for COSM data.
            #You can change the 'interval' parameter corresponding to 
            #described parameter under 'interval' here: https://cosm.com/docs/v2/history.html
            response = urllib2.urlopen("http://api.cosm.com/v2/feeds/"+search_for+".json?start="+starttime+"&end="+endtime+"&timezone="+localoffset_in_hours+"&interval=60&interval_type=discrete&find_previous=true&key="+xApiKey).read()
            history = json.loads(response)
            datastreams = history["datastreams"]
            
            aqes = []
            aqes.append(aqe[i][0])
            aqes.append(aqe[i][1])
            insert = []
            for j in range(len(datastreams)):
                #Find the correct datastreams
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
                        
                        if datapoints != []:
                            #Build the 
                            for datapoint in datapoints:
                                if values == "":
                                    values = datapoint["at"] + "," + datapoint["value"]
                                else:
                                    values = values + "@" + datapoint["at"] + "," + datapoint["value"]
                            insert.append(values)
                        
            #Call method to insert parsed values
            insertAQEDataToSOS(insert,aqes,starttime,endtime)
            
        except KeyError as kE:
            logger.error("Following Error occured for AQE:"+search_for+": "+str(kE));
        except HTTPError as HTTPEr:
            logger.error("Following Error occured for AQE:"+search_for+": "+str(HTTPEr));
            
#This method inserts the passed data to the SOS
def insertAQEDataToSOS(inserts,aqe,start,end):
    count = 1
    valuesToInsert = ""
    values = []
    
    while (count <= len(inserts)):
        values.append(inserts[count].split("@"))
        count = count + 2
    
    try:
        #Build the string containing the values which should be inserted.
        #Convert values from ppb to ppm
        for j in range(len(values[0])):
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
                count2 = count2 + 1
    except IndexError as iE:
        logger.error("Following Error occured for AQE with feedID:"+str(aqe[0])+": "+str(iE))
    
    logger.info("Insert following values for AQE with feedID:"+aqe[0]+" and AssignedSensorId: "+aqe[1]+":"+valuesToInsert);
    
    start = start+"+02:00"
    end = end+"+02:00"
    
    three_hours_from_now = datetime.now() + timedelta(hours=3)
    endtime = '{:%Y-%m-%dT%H:30:00+02}'.format(three_hours_from_now)
    
    #InsertObservation string in XML format
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

    #Send request to insert data to SOS
    headers = {"Content-type": "application/raw", "Accept": "text/plain"}
    request = urllib2.Request("http://giv-geosoft2d.uni-muenster.de/istsos/cosmcosm",insert_Observation,headers)
    handler = urllib2.urlopen(request)
    logger.info(handler.read());
    
    
if __name__ == '__main__':
    logger.info("Parser process started.")
    getAQEFromSos()
    logger.info("Parser process finished.")