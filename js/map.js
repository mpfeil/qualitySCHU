var map = L.map('map').setView([51.966667, 7.633333], 6);
var data;
var data2;
var checked;
var lanuv = L.icon({
    iconUrl: 'img/tower.png',
    iconSize: [41, 41],
    iconAnchor: [25, 40],
    popupAnchor: [-3, -40],
});
var aqe = L.icon({
    iconUrl: 'img/egg.png',
    iconSize: [41, 41],
    iconAnchor: [25, 40],
    popupAnchor: [-3, -40],
});
var marker = new L.Marker([50,7]);
var clusters = new L.MarkerClusterGroup({showCoverageOnHover: false});

L.tileLayer('http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/997/256/{z}/{x}/{y}.png', {
	maxZoom: 18,
	attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>'
}).addTo(map);

map.addLayer(clusters);

$(document).ready(function($){
	console.log("ready");
	cosm.setKey("tT0xUa9Yy24qPaZXDgJi-lDmf3iSAKxvMEhJWDBleHpMWT0g");

	clusters.fire('data:loading');
	cosm.request({type: "get", url: "http://api.cosm.com/v2/feeds?lat=51.964894415545814&lon=7.6238250732421875&distance=100.0&q=AQE", done: addAQE});
});

function addLANUV()
{
	for(station in stationen)
	{
		marker = new L.Marker(new L.LatLng(stationen[station].latitude,stationen[station].longitude),{icon:lanuv, title:station});
		clusters.addLayer(marker);
	}

	clusters.fire('data:loaded');
}

function onLocationFound(e) 
{
	map.setView(e.latlng,10);
}

function onLocationError(e) 
{
	alert(e.message);
}

map.on('locationfound', onLocationFound);
map.on('locationerror', onLocationError);
clusters.on('beforeDataLoad',   function() { layer.fire('data:loading'); });
clusters.on('dataLoadComplete', function() { layer.fire('data:loaded'); });

marker.on('click', function(e){
	console.log(e);
});

clusters.on('click', function(e){

	if(isNaN(e.layer.options.title))
	{
		console.log("is not number:"+e.layer.options.title);
		checked = e.layer.options.title;
		$('.carousel').carousel(1);
	}
	else
	{
		console.log("is a number:"+e.layer.options.title);
		$('.carousel').carousel(0);
		checked = e.layer.options.title;
		$('#tempForm').cosm('live', {feed: e.layer.options.title, datastream:'temperature'});
		$('#humForm').cosm('live', {feed: e.layer.options.title, datastream:'humidity'});
		$('#no2Form').cosm('live', {feed: e.layer.options.title, datastream:'NO2'});
		$('#coForm').cosm('live', {feed: e.layer.options.title, datastream:'CO'});
	}
})

function addAQE(results)
{
	data = results.results;
	
	console.log(data.length)
	
	for(var i = 0; i < data.length; i++)
	{
		marker = new L.Marker(new L.LatLng(data[i].location.lat,data[i].location.lon),{icon:aqe, title:data[i].id});
		clusters.addLayer(marker);
	}
	
	jQuery.ajax({
        url: 'http://www.lanuv.nrw.de/luft/temes/stationen.js',
        type: 'get',
        dataType: 'script',
        success:addLANUV
     });
}

function updateTable(start,end)
{
	console.log(start);
	console.log(end);
	eventtime_start = start.toString('yyyy-MM-ddT00:00:00+01:00');
	eventtime_end = end.toString('yyyy-MM-ddT23:00:00+01:00');
	var td = new Array();
	jQuery.ajax({
        url: 'http://giv-geosoft2d.uni-muenster.de/istsos/wa/istsos/services/lanuv/operations/getobservation/offerings/temporary/procedures/'+checked+'/observedproperties/urn:ogc:def:parameter:x-istsos:1.0:neteo:air:wv,urn:ogc:def:parameter:x-istsos:1.0:meteo:air:temperature,urn:ogc:def:parameter:x-istsos:1.0:meteo:air:so2,urn:ogc:def:parameter:x-istsos:1.0:meteo:air:pm10,urn:ogc:def:parameter:x-istsos:1.0:meteo:air:ozone,urn:ogc:def:parameter:x-istsos:1.0:meteo:air:no,urn:ogc:def:parameter:x-istsos:1.0:meteo:air:no2,urn:ogc:def:parameter:x-istsos:1.0:meteo:air:humidity/eventtime/'+eventtime_start+'/'+eventtime_end+'?_dc=1363547035889',
        type: 'get',
        dataType: "json",
        success:function(data3){
        	data2 = data3;
        	for(var i = 0; i < data2.data[0].result.DataArray.values.length; i++)
        	{
        		newtablerow = "";
        		td = data2.data[0].result.DataArray.values[i];
	        	date = new Date(td[0]).toString('d.MM.yyyy HH:mm:ss');
	        	console.log(date.toString('d.MM.yyyy '));
	        	for(var j = 2; j < td.length; j = j + 2)
	        	{
		        	if(td[j]=="100")
		        	{
			        	console.log("raw");
			        	newtablerow = newtablerow + '<td class="tdwarning">'+td[j-1]+'</td>';
		        	}
		        	else if(td[j]=="101")
		        	{
			        	console.log("validated and outlier");
			        	newtablerow = newtablerow + '<td class="tderror">'+td[j-1]+'</td>';
		        	}
		        	else if(td[j]=="102")
		        	{
			        	console.log("validated and not outlier");
			        	newtablerow = newtablerow + '<td class="tdsuccess">'+td[j-1]+'</td>';
		        	}
		        	else
		        	{
			        	console.log("NaN");
			        	newtablerow = newtablerow + '<td>'+td[j-1]+'</td>';
		        	}
	        	}
	        	$('#tablebody').append('<tr class="trbody"><td>'+date+'</td>'+newtablerow+'</tr>');
        	}
        }
    });
	
}

function updateDiagram()
{	
	var limit = 100000;    //increase number of dataPoints by increasing this
   
	var y = 0;
	var data5 = []; 
	var dataSeries = { type: "line" };
	var dataPoints = [];
	/*
for (var i = 0; i < limit; i += 1) {
    	y += (Math.random() * 10 - 5);
    	dataPoints.push({
	    	x: i - limit / 2,
	    	y: y,                
	    });
	}
*/
	dataSeries.dataPoints = dataPoints;
	data5.push(dataSeries);
	
	chart = new CanvasJS.Chart("chartContainer",
    {
      zoomEnabled: true,
      title:{
        text: "Stress Test: 100,000 Data Points", 
      },
      axisX:{
        labelAngle: 30,
      },
      
      axisY :{
        includeZero:false
      },
      
      data: data5,  // random generator below
      
    });

    chart.render();	 
}