var map = L.map('map').setView([51.966667, 7.633333], 6);
var data;
var data2;
var selectedService;
var checkedStation;
var selectedMarker;

//Data Array for Diagram. Contains the single dataSeries
var diagramData = [];
// var dataSeries = { type: "line", markerType: "circle"};
// var dataPoints = [];
// var dataSeries2 = { type: "line", axisYType: "secondary", markerType: "circle",};
// var dataPoints2 = [];

//Single dataSeries for diagram
// var temperature = {type: "line", lineThickness: 2, showInLegend: true, name: "Temperatur"};
// var no = {type: "line", lineThickness: 2, showInLegend: true, name: "NO"};
// var no2 = {type: "line", lineThickness: 2, showInLegend: true, name: "NO2"};
// var ozone = {type: "line", lineThickness: 2, showInLegend: true, name: "Ozon"};
// var pm10 = {type: "line", lineThickness: 2, showInLegend: true, name: "PM10"};
// var so2 = {type: "line", lineThickness: 2, showInLegend: true, name: "SO2"};
// var wv = {type: "line", lineThickness: 2, showInLegend: true, name: "Windgeschwindigkeit"};
// var humidity = {type: "line", lineThickness: 2, showInLegend: true, name: "Luftfeuchtigkeit"}; 

var lanuv = L.icon({
    iconUrl: 'img/lanuv.png',
    iconSize: [41, 41],
    iconAnchor: [25, 40],
    popupAnchor: [-3, -40],
});
var lanuv_selected = L.icon({
    iconUrl: 'img/lanuv_selected.png',
    iconSize: [41, 41],
    iconAnchor: [25, 40],
    popupAnchor: [-3, -40],
});
var aqe = L.icon({
    iconUrl: 'img/aqe.png',
    iconSize: [41, 41],
    iconAnchor: [25, 40],
    popupAnchor: [-3, -40],
});
var aqe_selected = L.icon({
    iconUrl: 'img/aqe_selected.png',
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

	cosm.request({type:"GET",url:"http://api.cosm.com/v2/feeds?&q=aqe&content=summary&status=live&per_page=150", done: addAQE});
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

clusters.on('click', function(e){
	if (selectedMarker!= null && isNaN(selectedMarker.options.title)) {selectedMarker.setIcon(lanuv)} else if (selectedMarker!= null && Number(selectedMarker.options.title)) {selectedMarker.setIcon(aqe)};
	checkedStation = e.layer.options.title;
	selectedMarker = e.layer;
	if(isNaN(checkedStation))
	{
		$('.carousel').carousel(1);
		selectedMarker.setIcon(lanuv_selected);
		selectedService = "lanuv";
	}
	else
	{
		selectedMarker.setIcon(aqe_selected);
		selectedService = "cosm";
		$('.carousel').carousel(0);
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
		try {
			marker = new L.Marker(new L.LatLng(data[i].location.lat,data[i].location.lon),{icon:aqe, title:data[i].id});
			clusters.addLayer(marker);
		}
		catch(err){
			console.log(err);
		}
		
	}
	
	jQuery.ajax({
        url: 'http://www.lanuv.nrw.de/luft/temes/stationen.js',
        type: 'get',
        dataType: 'script',
        success:addLANUV
     });
}

function getTz(offset)
{
	offset = offset / -60;
	if (offset>=0 && offset <10)
	{
		strTz = "+0"+String(offset);
	}
	else if (offset>=0 && offset >= 10)
	{
		strTz = String(offset);	
	}
	else if (offset<=0 && offset <10)
	{
		strTz = "-0"+String(offset);	
	}
	else if (offset<=0 && offset >10)
	{
		strTz = String(offset);	
	}

	return strTz;
}

function updateTable(start,end)
{
	eventtime_start = start.toString('yyyy-MM-ddT00:00:00');
	eventtime_start = eventtime_start + getTz(start.getTimezoneOffset());
	eventtime_end = end.toString('yyyy-MM-ddT23:00:00');
	eventtime_end = eventtime_end + getTz(end.getTimezoneOffset());
	// console.log(eventtime_start);
	// console.log(eventtime_end);
	
	var td = new Array();
	jQuery.ajax({
        url: 'http://giv-geosoft2d.uni-muenster.de/istsos/wa/istsos/services/'+selectedService+'/operations/getobservation/offerings/temporary/procedures/'+checkedStation+'/observedproperties/urn:ogc:def:parameter:x-istsos:1.0:neteo:air:wv,urn:ogc:def:parameter:x-istsos:1.0:meteo:air:temperature,urn:ogc:def:parameter:x-istsos:1.0:meteo:air:so2,urn:ogc:def:parameter:x-istsos:1.0:meteo:air:pm10,urn:ogc:def:parameter:x-istsos:1.0:meteo:air:ozone,urn:ogc:def:parameter:x-istsos:1.0:meteo:air:no,urn:ogc:def:parameter:x-istsos:1.0:meteo:air:no2,urn:ogc:def:parameter:x-istsos:1.0:meteo:air:humidity/eventtime/'+eventtime_start+'/'+eventtime_end+'?_dc=1363547035889',
        type: 'get',
        dataType: "json",
        success:function(data3){
        	data2 = data3;
        	console.log(data2);
        	for(var i = 0; i < data2.data[0].result.DataArray.values.length; i++)
        	{
        		newtablerow = "";
        		td = data2.data[0].result.DataArray.values[i];
	        	// date = new Date(td[0]);
	        	// printdate = date.toString('dd.MM.yyyy');
	        	// // if (date.getTime > )
	        	// console.log(printdate);
	        	// hours = date.getHours()-1;
	        	// printdate = printdate +" "+hours;
	        	// printdate = printdate +":00:00";
	        	// console.log(printdate);
	        	// console.log(date.getHours()-1);
	        	// console.log(String(date.getHours()-1));
	        	date = new Date(td[0]).toString('dd.MM.yyyy HH:mm:ss');
	        	// console.log(date);
	        	// console.log(date.toString('dd.MM.yyyy '));
	        	for(var j = 2; j < td.length; j = j + 2)
	        	{
		        	if(td[j]=="100")
		        	{
			        	// console.log("raw");
			        	newtablerow = newtablerow + '<td class="tdwarning">'+td[j-1]+'</td>';
		        	}
		        	else if(td[j]=="101")
		        	{
			        	// console.log("validated and outlier");
			        	newtablerow = newtablerow + '<td class="tderror">'+td[j-1]+'</td>';
		        	}
		        	else if(td[j]=="102")
		        	{
			        	// console.log("validated and not outlier");
			        	newtablerow = newtablerow + '<td class="tdsuccess">'+td[j-1]+'</td>';
		        	}
		        	else
		        	{
			        	// console.log("NaN");
			        	newtablerow = newtablerow + '<td>-</td>';
		        	}
	        	}
	        	$('#tablebody').append('<tr class="trbody"><td>'+date+'</td>'+newtablerow+'</tr>');
        	}
        }
    });
	
}

function addToDiagram(elems,start,end)
{
	query = "";
	
	//Build query string
	for (var i = 0; i < elems.length; i++)
	{
		if (query == "")
		{
			query = "urn:ogc:def:parameter:x-istsos:1.0:meteo:air:" + elems[i];	
		}
		else
		{
			query = query + ",urn:ogc:def:parameter:x-istsos:1.0:meteo:air:" + elems[i]	
		}
	}
	
	//Setup timestamps for querying data
	eventtime_start = start.toString('yyyy-MM-ddTHH:mm:ss');
	eventtime_start = eventtime_start + getTz(start.getTimezoneOffset());
	eventtime_end = end.toString('yyyy-MM-ddTHH:mm:ss');
	eventtime_end = eventtime_end + getTz(end.getTimezoneOffset());
	jQuery.ajax({
        url: 'http://giv-geosoft2d.uni-muenster.de/istsos/wa/istsos/services/'+selectedService+'/operations/getobservation/offerings/temporary/procedures/'+checkedStation+'/observedproperties/'+query+'/eventtime/'+eventtime_start+'/'+eventtime_end+'?_dc=1363547035889',
        type: 'get',
        dataType: "json",
        success:function(data3){
        	data2 = data3;
        	var dataSeries2 = { type: "line", markerType: "circle",};
		    var dataPoints2 = [];
		    diagramData = [];
        	for(var i = 0; i < data2.data[0].result.DataArray.values.length; i++)
        	{
        		td = data2.data[0].result.DataArray.values[i];
        		var yValue = (isNaN(parseFloat(td[1]))) ? null : parseFloat(td[1]);
        		dateTime = new Date(td[0]);
        		dataPoints2.push({
		          x: dateTime,
		          y: yValue,
		          markerType: "circle"                
		        });
        	}

		     dataSeries2.dataPoints = dataPoints2; 

		     diagramData.push(dataSeries); 
		     diagramData.push(dataSeries2);
		     chart.options.data = diagramData;	
			 chart.render();
        }
    });
}