var map = L.map('map').setView([51.966667, 7.633333], 6);
var data;
var checked;

var myIcon = L.icon({
    iconUrl: 'img/tower.png',
    iconSize: [41, 41],
    iconAnchor: [25, 40],
    popupAnchor: [-3, -40],
});
var marker = new L.Marker([50,7],{icon:myIcon});
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
	cosm.request({type: "get", url: "http://api.cosm.com/v2/feeds?lat=51.964894415545814&lon=7.6238250732421875&distance=100.0&q=AQE", done: myCallbackFunction});
	
	$.get("http://giv-geosoft2d.uni-muenster.de/istsos/wa/istsos/services/lanuv/procedures/operations/getlist", function(data){
		console.log("hallo");
	});
});

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
	$('#myCarousel').carousel('next');
	checked = e.layer.options.title;
	$('#tempForm').cosm('live', {feed: e.layer.options.title, datastream:'temperature'});
	$('#humForm').cosm('live', {feed: e.layer.options.title, datastream:'humidity'});
	$('#no2Form').cosm('live', {feed: e.layer.options.title, datastream:'NO2'});
	$('#coForm').cosm('live', {feed: e.layer.options.title, datastream:'CO'});
})

function myCallbackFunction(results)
{
	data = results.results;
	
	console.log(data.length)
	
	for(var i = 0; i < data.length; i++)
	{
		marker = new L.Marker(new L.LatLng(data[i].location.lat,data[i].location.lon),{icon:myIcon, title:data[i].id});
		clusters.addLayer(marker);
	}
	
	clusters.fire('data:loaded');
}

//Callback Function
function loadLANUV(data)
{
	console.log(data)
}

window.onload = function () {
    
   
    var chart = new CanvasJS.Chart("chartContainer",
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
      
      data: data,  // random generator below
      
    });

    chart.render();
  }
  
   var limit = 100000;    //increase number of dataPoints by increasing this
   
   var y = 0;
   var data = []; var dataSeries = { type: "line" };
   var dataPoints = [];
   for (var i = 0; i < limit; i += 1) {
    y += (Math.random() * 10 - 5);
    dataPoints.push({
      x: i - limit / 2,
      y: y,                
    });
  }
  dataSeries.dataPoints = dataPoints;
  data.push(dataSeries);   