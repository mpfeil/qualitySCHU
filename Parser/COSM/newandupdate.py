'''
Created on 20.03.2013

@author: Matthias Pfeil
'''
import urllib2
import logging
import re
import json

xApiKey = "tT0xUa9Yy24qPaZXDgJi-lDmf3iSAKxvMEhJWDBleHpMWT0g"

def getAQEFeeds():
    request = urllib2.urlopen("http://api.cosm.com/v2/feeds?key=tT0xUa9Yy24qPaZXDgJi-lDmf3iSAKxvMEhJWDBleHpMWT0g&q=aqe&status=live&per_page=150").read()
    
    decoded_data = json.loads(request)
    
    for data in decoded_data["results"]:
        try:
            #TODO: Compare what to do update oder insert
            
            lat = str(data["location"]["lat"])
            lon = str(data["location"]["lon"])
            
            if(str(data["location"]["exposure"]) != ''):
                keywords = str(data["location"]["exposure"])
            
            print lat+";"+lon+";"+keywords
            #TODO: Abholen der Streams
            
            #TODO: RegisterSensor Statement bauen
            
            
            #print keywords+";"+lat+";"+lon
                #register_sensor = '{"system_id":"'+str(data["id"])+'","system":"'+str(data["id"])+'","description":"","keywords":"'+keywords+'","identification":[],"classification":[{"name":"System Type","definition":"urn:ogc:def:classifier:x-istsos:1.0:systemType","value":"insitu-fixed-point"},{"name":"Sensor Type","definition":"urn:ogc:def:classifier:x-istsos:1.0:sensorType","value":"aqe"}],"characteristics":"","contacts":[],"documentation":[],"capabilities":[],"location":{"type":"Feature","geometry":{"type":"Point","coordinates":["'+lon+'","'+lat+'","0"]},"crs":{"type":"name","properties":{"name":"4326"}},"properties":{"name":"'+str(data["id"])+'"}},"interfaces":"","inputs":[],"outputs":[{"name":"Time","definition":"urn:ogc:def:parameter:x-istsos:1.0:time:iso8601","uom":"iso8601","description":"","constraint":{"role":null,"interval":null}},{"name":"co","definition":"urn:ogc:def:parameter:x-istsos:1.0:meteo:air:co","uom":"ppb","description":"","constraint":{"role":null,"interval":["",""]}},{"name":"humidity","definition":"urn:ogc:def:parameter:x-istsos:1.0:meteo:air:humidity","uom":"%","description":"","constraint":{"role":null,"interval":["",""]}},{"name":"no2","definition":"urn:ogc:def:parameter:x-istsos:1.0:meteo:air:no2","uom":"ppb","description":"","constraint":{"role":null,"interval":["",""]}},{"name":"temperature","definition":"urn:ogc:def:parameter:x-istsos:1.0:meteo:air:temperature","uom":"deg","description":"","constraint":{"role":null,"interval":["",""]}}],"history":[]}'
                #print register_sensor
                
                #headers = {"Content-type": "application/raw", "Accept": "text/plain"}
                #request = urllib2.Request("http://giv-geosoft2d.uni-muenster.de/istsos/wa/istsos/services/cosm/procedures",register_sensor,headers)
                #handler = urllib2.urlopen(request)
                #response = handler.read()
                #response_data = json.loads(response)
                #print response_data["message"]
            
        except KeyError as kE:
            print "Error:"+str(kE)+" not found for "+str(data["id"])

def updateAQEFeeds():
    print "test"

if __name__ == '__main__':
    getAQEFeeds()