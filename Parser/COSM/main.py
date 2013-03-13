'''
Created on 13.03.2013

@author: Matthias Pfeil
'''
import urllib2
import logging
import re
import json
import time

xApiKey = "tT0xUa9Yy24qPaZXDgJi-lDmf3iSAKxvMEhJWDBleHpMWT0g"

def getAQEFeeds():
    aqe = []
    request = urllib2.urlopen("http://api.cosm.com/v2/feeds?key="+xApiKey+"&user=airqualityegg&status=live&per_page=150").read()
    
    decoded_data = json.loads(request)
    for data in decoded_data["results"]:
        aqe.append(data["id"])
    
    getDatastreamsOfAQEFeeds(aqe)

def getDatastreamsOfAQEFeeds(aqe):
    j = 0
    for i in range(len(aqe)):
        j = j + 1
        print i
        print aqe[i]
        response = urllib2.urlopen("http://api.cosm.com/v2/feeds/"+str(aqe[i])+".json?key="+xApiKey).read()
        print response

def getDatapointsOfAQEFeeds():
    return "asdf"

if __name__ == '__main__':
    getAQEFeeds()