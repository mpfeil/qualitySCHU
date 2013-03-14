'''
Created on 30.12.2012

@author: Matthias Pfeil
'''
import urllib2
import logging
import re
import json
import time
from bs4 import BeautifulSoup
from datetime import datetime, timedelta

sos_url = "http://giv-geosoft2d.uni-muenster.de/istsosold/qualityschu"
getCapabilities = "?request=getCapabilities&sections=operationsmetadata&service=SOS&version=1.0.0"

logger = logging.getLogger('LANUV')
hdlr = logging.FileHandler('/Users/matze/Downloads/logs/lanuv.log')
formatter = logging.Formatter('%(asctime)s: %(levelname)s %(message)s')
hdlr.setFormatter(formatter)
logger.addHandler(hdlr)
logger.setLevel(logging.INFO)

ozon = ""
no = ""
no2 = ""
ltem = ""
wri = ""
wges = ""
rfeu = ""
so2 = ""
staub = ""

def getStationsOfSOS():
    stations = []
    
    response = urllib2.urlopen('http://giv-geosoft2d.uni-muenster.de/istsos/wa/istsos/services/lanuv/procedures/operations/getlist').read()
    decoded_data = json.loads(response)
    
    for data in decoded_data["data"]:
        temp = []
        temp.append(data["name"])
        temp.append(data["assignedid"])
        stations.append(temp) 
    
    return stations

def insertObservation(station,values,local):
    
    one_hour_from_now = datetime.now() + timedelta(hours=1)
    #print one_hour_from_now
    starttime = '{:%Y-%m-%dT%H:00:00+01}'.format(datetime.now())
    endtime = '{:%Y-%m-%dT%H:30:00+01}'.format(one_hour_from_now)
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
   <sos:AssignedSensorId>'+station[1]+'</sos:AssignedSensorId>\n\
   <om:Observation>\n\
    <om:procedure xlink:href="urn:ogc:def:procedure:x-istsos:1.0:'+station[0]+'"/>\n\
    <om:samplingTime>\n\
      <gml:TimePeriod>\n\
        <gml:beginPosition>'+starttime+'</gml:beginPosition>\n\
        <gml:endPosition>'+endtime+'</gml:endPosition>\n\
      </gml:TimePeriod>\n\
    </om:samplingTime>\n\
    <om:observedProperty xlink:href="">\n\
      <swe:CompositPhenomenon dimension="9">\n\
        <swe:component xlink:href="urn:ogc:def:parameter:x-istsos:1.0:time:iso8601"/>\n\
        <swe:component xlink:href="urn:ogc:def:parameter:x-istsos:1.0:meteo:air:humidity" />\n\
        <swe:component xlink:href="urn:ogc:def:parameter:x-istsos:1.0:meteo:air:no" />\n\
        <swe:component xlink:href="urn:ogc:def:parameter:x-istsos:1.0:meteo:air:no2" />\n\
        <swe:component xlink:href="urn:ogc:def:parameter:x-istsos:1.0:meteo:air:wv" />\n\
        <swe:component xlink:href="urn:ogc:def:parameter:x-istsos:1.0:meteo:air:temperature" />\n\
        <swe:component xlink:href="urn:ogc:def:parameter:x-istsos:1.0:meteo:air:so2" />\n\
        <swe:component xlink:href="urn:ogc:def:parameter:x-istsos:1.0:meteo:air:pm10" />\n\
        <swe:component xlink:href="urn:ogc:def:parameter:x-istsos:1.0:meteo:air:ozone" />\n\
      </swe:CompositPhenomenon>\n\
    </om:observedProperty>\n\
    <om:featureOfInterest xlink:href="urn:ogc:def:feature:x-istsos:1.0:Point:'+station[0]+'"/>\n\
      <om:result>\n\
        <swe:DataArray>\n\
          <swe:elementCount>\n\
            <swe:Count>\n\
              <swe:value>9</swe:value>\n\
            </swe:Count>\n\
          </swe:elementCount>\n\
          <swe:elementType name="SimpleDataArray">\n\
              <swe:DataRecord definition="http://mmiws.org/ont/x/timeSeries">\n\
                <swe:field name="Time">\n\
                  <swe:Time definition="urn:ogc:def:parameter:x-istsos:1.0:time:iso8601"/>\n\
                </swe:field>\n\
                <swe:field name="humidity">\n\
                  <swe:Quantity definition="urn:ogc:def:parameter:x-istsos:1.0:meteo:air:humidity">\n\
                    <swe:uom code="%"/>\n\
                  </swe:Quantity>\n\
                </swe:field>\n\
                <swe:field name="nitrogen monoxide">\n\
                  <swe:Quantity definition="urn:ogc:def:parameter:x-istsos:1.0:meteo:air:no">\n\
                    <swe:uom code="mug"/>\n\
                  </swe:Quantity>\n\
                </swe:field>\n\
                  <swe:field name="nitrogen dioxide">\n\
                  <swe:Quantity definition="urn:ogc:def:parameter:x-istsos:1.0:meteo:air:no2">\n\
                    <swe:uom code="mug"/>\n\
                  </swe:Quantity>\n\
                  </swe:field>\n\
                  <swe:field name="wind velocity">\n\
                  <swe:Quantity definition="urn:ogc:def:parameter:x-istsos:1.0:meteo:air:wv">\n\
                    <swe:uom code="m/s"/>\n\
                  </swe:Quantity>\n\
                  </swe:field>\n\
                  <swe:field name="temperature">\n\
                  <swe:Quantity definition="urn:ogc:def:parameter:x-istsos:1.0:meteo:air:temperature">\n\
                    <swe:uom code="deg"/>\n\
                  </swe:Quantity>\n\
                  </swe:field>\n\
                  <swe:field name="sulfur dioxide">\n\
                  <swe:Quantity definition="urn:ogc:def:parameter:x-istsos:1.0:meteo:air:so2">\n\
                    <swe:uom code="mug"/>\n\
                  </swe:Quantity>\n\
                  </swe:field>\n\
                  <swe:field name="pm10">\n\
                  <swe:Quantity definition="urn:ogc:def:parameter:x-istsos:1.0:meteo:air:pm10">\n\
                    <swe:uom code="mug"/>\n\
                  </swe:Quantity>\n\
                  </swe:field>\n\
                  <swe:field name="ozone">\n\
                  <swe:Quantity definition="urn:ogc:def:parameter:x-istsos:1.0:meteo:air:ozone">\n\
                    <swe:uom code="mug"/>\n\
                  </swe:Quantity>\n\
                  </swe:field>\n\
              </swe:DataRecord>\n\
          </swe:elementType>\n\
        <swe:encoding>\n\
          <swe:TextBlock tokenSeparator="," blockSeparator="@" decimalSeparator="."/>\n\
        </swe:encoding>\n\
        <swe:values>'+values+'</swe:values>\n\
      </swe:DataArray>\n\
    </om:result>\n\
  </om:Observation>\n\
</sos:InsertObservation>'
    
    print insert_Observation
    
    headers = {"Content-type": "application/raw", "Accept": "text/plain"}
    request = urllib2.Request("http://giv-geosoft2d.uni-muenster.de/istsos/lanuv",insert_Observation,headers)
    handler = urllib2.urlopen(request)
    print handler.read()
    

if __name__ == '__main__':
    logger.info("Parse process started")
    
    #print datetime.now()
    starttime = '{:%Y-%m-%dT%H:00:00+01}'.format(datetime.now())
    #print starttime
    #one_and_a_half_hours_from_now = datetime.now() + timedelta(hours=1,minutes=30)
    #print one_and_a_half_hours_from_now
    #endtime = '{:%Y-%m-%dT%H:%M:%S+01}'.format(one_and_a_half_hours_from_now)
    #print endtime
    #print datetime.now()
    #nine_hours_from_now = datetime.now() + timedelta(hours=1,minutes=30)
    #print nine_hours_from_now
    #print '{:%Y-%m-%dT%H:%M:%S+01}'.format(nine_hours_from_now)
    
    localtime = time.localtime(time.time())
    #starttime = str(time.strftime("%Y-%m-%dT%H:00:00+01", localtime))
    #print starttime
    #endtime = str(time.strftime("%Y-%m-%dT"+str(localtime[3]+1)+":30:00+01", localtime))
    #print str(localtime[3]) +":00"
    stations = getStationsOfSOS()
    
    for i in range(len(stations)):
        response = urllib2.urlopen('http://www.lanuv.nrw.de/luft/temes/heut/'+stations[i][0]+'.htm').read()
        
        soup = BeautifulSoup(response, "lxml")
        
        localtime = time.localtime(time.time())
        #print localtime
        starttime = str(time.strftime("%Y-%m-%dT%H:00:00+01", localtime))
        endtime = str(time.strftime("%Y-%m-%dT"+str(localtime[3]+1)+":30:00+01", localtime))
        
        #print time.time()
        #print str(time.strftime("%Y-%m-%dT%H:00:00+01", time.time()))
        #print localtime
        #print starttime
        #print endtime
        #print localtime[3]+13
        if str(localtime[3]) == '00':
            search = "24:00"
        else:
            search = str(localtime[3])+":00"
        print search
        try:
            rows = soup.find('td', text = re.compile(search), attrs = {'class' : 'mw_zeit'}).findPrevious('tr').findAll('td')
            
            ozon = rows[2].get_text().lstrip()
            no = rows[3].get_text().lstrip()
            no2 = rows[4].get_text().lstrip()
            ltem = rows[5].get_text().lstrip()
            wri = rows[6].get_text().lstrip()
            wges = rows[7].get_text().lstrip()
            rfeu = rows[8].get_text().lstrip()
            so2 = rows[9].get_text().lstrip()
            staub = rows[10].get_text().lstrip()
            iso_datetime = str(time.strftime("%Y-%m-%dT%H:00:00+01", localtime)) 
            logger.info("Successfully parsed values for Station "+str(stations[i][0])+" for "+str(localtime[3]) +":00 : "+rfeu+","+no+","+no2+","+wges+","+ltem+","+so2+","+staub+","+ozon)
            values = iso_datetime+","+ozon+","+no+","+no2+","+ltem+","+wges+","+rfeu+","+so2+","+staub
            
            insertObservation(stations[i],values, localtime)
        except AttributeError as aE:
            print aE
            logger.error("No values for LANUV Station "+str(stations[i])+" at "+str(localtime[3])+":00"+" available!")