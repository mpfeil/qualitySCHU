'''
Created on 30.12.2012

@author: Matthias Pfeil
'''
import urllib2
import logging
#import re
#import httplib
#import psycopg2
#import sys
import time
from bs4 import BeautifulSoup

logger = logging.getLogger('LANUV')
hdlr = logging.FileHandler('/Users/matze/Downloads/logs/lanuv.log')
formatter = logging.Formatter('%(asctime)s %(levelname)s %(message)s')
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

if __name__ == '__main__':
    logger.info("Parse process started")
    sos_url = "http://giv-geosoft2d.uni-muenster.de/istsos/test/"
    
    register_sensor = '<?xml version="1.0" encoding="UTF-8"?>\n\
<sos:RegisterSensor service="SOS"\n\
    xsi:schemaLocation="http://schemas.opengis.net/sos/1.0.0/sosAll.xsd"\n\
    xmlns:gml="http://www.opengis.net/gml"\n\
    xmlns:xlink="http://www.w3.org/1999/xlink"\n\
    xmlns:swe="http://www.opengis.net/swe/1.0.1"\n\
    xmlns:om="http://www.opengis.net/om/1.0"\n\
    xmlns="http://www.opengis.net/sos/1.0"\n\
    xmlns:sos="http://www.opengis.net/sos/1.0"\n\
    xmlns:ows="http://www.opengis.net/ows/1.1"\n\
    xmlns:ogc="http://www.opengis.net/ogc"\n\
    xmlns:tml="http://www.opengis.net/tml"\n\
    xmlns:sml="http://www.opengis.net/sensorML/1.0.1"\n\
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n\
    version="1.0.0">\n\
<SensorDescription>\n\
    <sml:member>\n\
      <sml:System gml:id="H_TREVANO">\n\
        <gml:name>H_TREVANO</gml:name>\n\
        <sml:identification/>\n\
        <sml:classification>\n\
          <sml:ClassifierList>\n\
            <sml:classifier name="System Type">\n\
              <sml:Term definition="urn:ogc:def:classifier:x-istsos:1.0:systemType">\n\
                <sml:value>insitu-fixed-point</sml:value>\n\
              </sml:Term>\n\
            </sml:classifier>\n\
            <sml:classifier name="Sensor Type">\n\
              <sml:Term definition="urn:ogc:def:classifier:x-istsos:1.0:sensorType">\n\
                <sml:value>humidity sensor</sml:value>\n\
              </sml:Term>\n\
            </sml:classifier>\n\
          </sml:ClassifierList>\n\
        </sml:classification>\n\
        <sml:capabilities>\n\
          <swe:DataRecord/>\n\
        </sml:capabilities>\n\
        <gml:location>\n\
          <gml:Point gml:id="trevano" srsName="EPSG:4326">\n\
            <gml:coordinates>8.961435,46.028235,350</gml:coordinates>\n\
          </gml:Point>\n\
        </gml:location>\n\
        <sml:outputs>\n\
          <sml:OutputList>\n\
            <sml:output name="output data">\n\
              <swe:DataRecord definition="urn:ogc:def:dataType:x-istsos:1.0:timeSeries">\n\
                <swe:field name="Time">\n\
                  <swe:Time definition="urn:ogc:def:parameter:x-istsos:1.0:time:iso8601" gml:id="1">\n\
                    <swe:uom code="iso8601"/>\n\
                  </swe:Time>\n\
                </swe:field>\n\
                <swe:field name="air humidity">\n\
                  <swe:Quantity definition="urn:ogc:def:parameter:x-istsos:1.0:meteo:air:humidity" gml:id="2">\n\
                    <swe:uom code="%"/>\n\
                  </swe:Quantity>\n\
                </swe:field>\n\
              </swe:DataRecord>\n\
            </sml:output>\n\
          </sml:OutputList>\n\
        </sml:outputs>\n\
      </sml:System>\n\
    </sml:member>\n\
  </SensorDescription>\n\
  <ObservationTemplate>\n\
    <om:Observation>\n\
      <om:procedure xlink:href="urn:ogc:object:procedure:x-istsos:1.0:H_TREVANO"/>\n\
      <om:samplingTime>\n\
        <gml:TimePeriod>\n\
          <gml:TimeLength/>\n\
        </gml:TimePeriod>\n\
      </om:samplingTime>\n\
      <om:observedProperty>\n\
        <swe:CompositPhenomenon dimension="2">\n\
          <swe:component xlink:href="urn:ogc:def:parameter:x-istsos:1.0:time:iso8601"/>\n\
          <swe:component xlink:href="urn:ogc:def:parameter:x-istsos:1.0:meteo:air:humidity"/>\n\
        </swe:CompositPhenomenon>\n\
      </om:observedProperty>\n\
      <om:featureOfInterest xlink:href="trevano">\n\
        <gml:Point gml:id="trevano" srsName="EPSG:4326">\n\
          <gml:coordinates>8.961435,46.028235,350</gml:coordinates>\n\
        </gml:Point>\n\
      </om:featureOfInterest>\n\
      <om:result>\n\
        <swe:DataArray>\n\
          <swe:elementCount>\n\
            <swe:value>2</swe:value>\n\
          </swe:elementCount>\n\
          <swe:elementType name="SimpleDataArray" xlink:href="urn:ogc:def:dataType:x-istsos:1.0:timeSeriesDataRecord">\n\
            <swe:DataRecord definition="urn:ogc:def:dataType:x-istsos:1.0:timeSeries">\n\
              <swe:field name="Time">\n\
                <swe:Time definition="urn:ogc:def:parameter:x-istsos::time:iso8601" gml:id="1">\n\
                  <swe:uom code="iso8601"/>\n\
                </swe:Time>\n\
              </swe:field>\n\
              <swe:field name="air humidity">\n\
                <swe:Quantity definition="urn:ogc:def:parameter:x-istsos:1.0:meteo:air:humidity" gml:id="2">\n\
                  <swe:uom code="%"/>\n\
                </swe:Quantity>\n\
              </swe:field>\n\
            </swe:DataRecord>\n\
          </swe:elementType>\n\
          <swe:encoding>\n\
            <swe:TextBlock blockSeparator="@" decimalSeparator="." tokenSeparator=","/>\n\
          </swe:encoding>\n\
          <swe:values/>\n\
        </swe:DataArray>\n\
      </om:result>\n\
    </om:Observation>\n\
  </ObservationTemplate>\n\
</sos:RegisterSensor>'
    
    response = urllib2.urlopen('http://www.lanuv.nrw.de/luft/temes/heut/BORG.htm#jetzt').read()
    
    soup = BeautifulSoup(response)
    
    rows = soup.find('table').find('tbody').findAll('tr')
    
    localtime = time.localtime(time.time())
    
    for row in rows:
        cells = row.findAll('td')
        
        if str(localtime[3]) +":00" == cells[0].get_text():
            ozon = cells[2].get_text()
            no = cells[3].get_text()
            no2 = cells[4].get_text()
            ltem = cells[5].get_text()
            wri = cells[6].get_text()
            wges = cells[7].get_text()
            rfeu = cells[8].get_text()
            so2 = cells[9].get_text()
            staub = cells[10].get_text()
            logger.info("Successfully parsed values for Station ... for "+str(localtime[3]) +":00 : "+ozon+","+no+","+no2+","+ltem+","+wri+","+wges+","+rfeu+","+so2+","+staub)
        else:
            logger.error("No values for LANUV Station at "+str(localtime[3])+":00"+" available!")
    
    print ozon+","+no+","+no2+","+ltem+","+wri+","+wges+","+rfeu+","+so2+","+staub
        
    
    #headers = {"Content-type": "application/raw", "Accept": "text/plain"}

    #request = urllib2.Request("http://giv-geosoft2d.uni-muenster.de/istsos/test",register_sensor,headers)
    
    #handler = urllib2.urlopen(request)
    
    #print handler.read()
    
    #response = urllib2.urlopen('http://www.lanuv.nrw.de/luft/temes/heut/VACW.htm#jetzt')
    #stationen = response.read()

    #print stationen

    #for line in re.finditer('stationen\\.(.+)\\.(.+)\s+=\s+(.+)', stationen):
       # print line.group(1) + " - " + line.group(2) + " - " + line.group(3)