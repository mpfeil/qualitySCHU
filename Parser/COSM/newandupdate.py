'''
Created on 20.03.2013

@author: Matthias Pfeil
'''
import urllib2
import logging
import json
from urllib2 import URLError

xApiKey = "tT0xUa9Yy24qPaZXDgJi-lDmf3iSAKxvMEhJWDBleHpMWT0g"
logger = logging.getLogger('COSM')
hdlr = logging.FileHandler('/Users/matze/downloads/logs/cosm.log')
formatter = logging.Formatter('%(asctime)s: %(levelname)s %(message)s')
hdlr.setFormatter(formatter)
logger.addHandler(hdlr)
logger.setLevel(logging.INFO)
insert = []
update = []
errors = []

# This Methode gets all the stuff together 
# which has to be updated or inserted to our SOS
def getAQEFeeds():
    try:
        logger.info("Checking COSM API for AQEs...")
        cosm = urllib2.urlopen("http://api.cosm.com/v2/feeds?key="+xApiKey+"&q=aqe&status=live&per_page=150").read()
        cosm_decoded_data = json.loads(cosm)
        logger.info("Found "+str(cosm_decoded_data["totalResults"])+" feeds via the cosm API.")
        logger.info("Checking SOS for exisiting AQEs...")
        sos = urllib2.urlopen("http://giv-geosoft2d.uni-muenster.de/istsos/wa/istsos/services/cosm/procedures/operations/getlist").read()
        sos_decoded_data = json.loads(sos)
        logger.info("Found "+str(sos_decoded_data["total"])+" via the SOS API.")
        availableFeedsInSos = []
        for sosdata in sos_decoded_data["data"]:
            availableFeedsInSos.append(sosdata["name"])
        
        logger.info("Preparing Inserts and Updates...")
        #Just prepare what could be updated. It is not a must have!
        for data in cosm_decoded_data["results"]:
            try:
                #Check if coordinates are provided
                if str(data["location"]["lat"]) and str(data["location"]["lon"]):
                    if str(data["id"]) in availableFeedsInSos:
                        update.append(data)
                    else:
                        insert.append(data)
                else:
                    raise KeyError
                
            except KeyError as kE:
                exceptionCode = str(kE)+" not found for feed with ID "+str(data["id"])+"! For more information check https://cosm.com/feeds/"+str(data["id"])
                errors.append(exceptionCode)
        
    except URLError as urlErr:
        logger.error(urlErr)
        print urlErr
    
    logger.info(str(len(update))+" can be updated!")
    logger.info(str(len(insert))+" must be insert!")
    logger.warning(str(len(errors))+" founded! Exception is following...")
    for kE in errors:
        logger.warning(kE)
    
    logger.info("Insert the new feeds...")
    insertAQEFeeds(insert)
    logger.info("Insert DONE. Watch out for exceptions during the insert!")
    
    #logger.info("Update existing feeds...")
    #updateAQEFeeds()
    #logger.info("Update DONE. Watch out for exceptions during the update!")

# This method inserts new AQE feeds to the SOS. Additionally this method
# checks the provided Sensors and builds the RegisterSensor statement.
def insertAQEFeeds(insert):
    successful = 0 
    unsuccessful = 0
    for feed in insert:
        additionalSensors = ""
        coID = ""
        no2ID = ""
        temperatureID = ""
        humidityID = ""
        if(str(feed["location"]["exposure"]) != ''):
            keywords = str(feed["location"]["exposure"])
        else:
            keywords = ""
        for datastreams in feed["datastreams"]:
            #print str(feed["id"])+": "+str(datastreams)
            if datastreams["tags"][0] == "aqe:data_origin=computed":
                if datastreams["tags"][len(datastreams["tags"])-1] == "aqe:sensor_type=CO":
                    coID = datastreams["id"]
                elif datastreams["tags"][len(datastreams["tags"])-1] == "aqe:sensor_type=NO2":
                    no2ID = datastreams["id"]
                elif datastreams["tags"][len(datastreams["tags"])-1] == "aqe:sensor_type=Temperature":
                    temperatureID = datastreams["id"]
                elif datastreams["tags"][len(datastreams["tags"])-1] == "aqe:sensor_type=Humidity":
                    humidityID = datastreams["id"]
                elif datastreams["tags"][len(datastreams["tags"])-1] == "aqe:sensor_type=Dust":
                    additionalSensors = additionalSensors + ',{"name":"dust","definition":"urn:ogc:def:parameter:x-istsos:1.0:meteo:air:dust","uom":"ppb","description":"'+datastreams["id"]+'","constraint":{"role":null,"interval":["",""]}}'
                elif datastreams["tags"][len(datastreams["tags"])-1] == "aqe:sensor_type=VOC":
                    additionalSensors = additionalSensors + ',{"name":"voc","definition":"urn:ogc:def:parameter:x-istsos:1.0:meteo:air:voc","uom":"ppb","description":"'+datastreams["id"]+'","constraint":{"role":null,"interval":["",""]}}'
                elif datastreams["tags"][len(datastreams["tags"])-1] == "aqe:sensor_type=O3":
                    additionalSensors = additionalSensors + ',{"name":"ozone","definition":"urn:ogc:def:parameter:x-istsos:1.0:meteo:air:o3","uom":"ppb","description":"'+datastreams["id"]+'","constraint":{"role":null,"interval":["",""]}}'    
            elif str(feed["id"]) == "75842":
                if datastreams["tags"][0] == "carbon monoxide":
                    coID = "CO"
                elif datastreams["tags"][0] == "nitrogen dioxide":
                    no2ID = "NO2"
                elif datastreams["tags"][0] == "temperature":
                    temperatureID = "temperature"
                elif datastreams["tags"][0] == "O3":
                    additionalSensors = additionalSensors + ',{"name":"ozone","definition":"urn:ogc:def:parameter:x-istsos:1.0:meteo:air:o3","uom":"ppb","description":"O3","constraint":{"role":null,"interval":["",""]}}'
                elif datastreams["tags"][0] == "relative humidity":
                    humidityID = "humidity"
        
        registerSensor = '{"system_id":"'+str(feed["id"])+'","system":"'+str(feed["id"])+'","description":"","keywords":"'+keywords+'","identification":[],"classification":[{"name":"System Type","definition":"urn:ogc:def:classifier:x-istsos:1.0:systemType","value":"insitu-fixed-point"},{"name":"Sensor Type","definition":"urn:ogc:def:classifier:x-istsos:1.0:sensorType","value":"aqe"}],"characteristics":"","contacts":[],"documentation":[],"capabilities":[],"location":{"type":"Feature","geometry":{"type":"Point","coordinates":["'+str(feed["location"]["lon"])+'","'+str(feed["location"]["lat"])+'","0"]},"crs":{"type":"name","properties":{"name":"4326"}},"properties":{"name":"'+str(feed["id"])+'"}},"interfaces":"","inputs":[],"outputs":[{"name":"Time","definition":"urn:ogc:def:parameter:x-istsos:1.0:time:iso8601","uom":"iso8601","description":"","constraint":{"role":null,"interval":null}},{"name":"co","definition":"urn:ogc:def:parameter:x-istsos:1.0:meteo:air:co","uom":"ppb","description":"'+str(coID)+'","constraint":{"role":null,"interval":["",""]}},{"name":"humidity","definition":"urn:ogc:def:parameter:x-istsos:1.0:meteo:air:humidity","uom":"%","description":"'+str(humidityID)+'","constraint":{"role":null,"interval":["",""]}},{"name":"no2","definition":"urn:ogc:def:parameter:x-istsos:1.0:meteo:air:no2","uom":"ppb","description":"'+str(no2ID)+'","constraint":{"role":null,"interval":["",""]}},{"name":"temperature","definition":"urn:ogc:def:parameter:x-istsos:1.0:meteo:air:temperature","uom":"deg C","description":"'+str(temperatureID)+'","constraint":{"role":null,"interval":["",""]}}'+additionalSensors+'],"history":[]}'
        #print registerSensor
        headers = {"Content-type": "application/raw", "Accept": "text/plain"}
        request = urllib2.Request("http://giv-geosoft2d.uni-muenster.de/istsos/wa/istsos/services/cosm/procedures",registerSensor,headers)
        handler = urllib2.urlopen(request)
        response = handler.read()
        response_data = json.loads(response)
        if response_data["success"]:
            logger.info("Feed with ID "+str(feed["id"])+" successfully inserted!")
            successful = successful + 1
        else:
            logger.error(response_data["message"])
            unsuccessful = unsuccessful + 1
        print response_data["message"]
    logger.info("Successful inserts: "+str(successful)+" feeds.")
    logger.warning("Unsuccessful inserts: "+str(unsuccessful)+" feeds. Watch the preceding errors!")

def updateAQEFeeds():
    print "test"

if __name__ == '__main__':
    logger.info("Parser process started.")
    getAQEFeeds()
    logger.info("Parser process finished.")
    