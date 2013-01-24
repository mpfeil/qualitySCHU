var map = L.map('map').setView([51.966667, 7.633333], 6);
var data;

var myIcon = L.icon({
    iconUrl: 'img/egg.png',
    iconSize: [41, 41],
    iconAnchor: [25, 40],
    popupAnchor: [-3, -40],
});
var marker = new L.Marker([50,7],{icon:myIcon});




L.tileLayer('http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/997/256/{z}/{x}/{y}.png', {
	maxZoom: 18,
	attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>'
}).addTo(map);

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
marker.on('click', function(e){
	console.log(e);
});


function locateMe()
{
	//Request Bohrungen from GeoServer
	var cosmJsonUrl = "http://api.cosm.com/v2/feeds?lat=51.964894415545814&lon=7.6238250732421875&distance=100.0&q=aqe&callback=myCallbackFunction";
	$.ajax({
		url: cosmJsonUrl,
		dataType: 'jsonp'
	});
	/*
$('#locateMe').popover('hide');
	map.locate({setView: true});
*/
	
}

var clusters = new L.MarkerClusterGroup({showCoverageOnHover: false});
map.addLayer(clusters);

function myCallbackFunction(results)
{
	data = results.results;
	
	for(var i = 0; i < data.length; i++)
	{
		marker = new L.Marker(new L.LatLng(data[i].location.lat,data[i].location.lon),{icon:myIcon});
/* 		marker.setLatLng(new L.LatLng(data[i].location.lat,data[i].location.lon)) */
		marker.bindPopup('<p>ID:'+data[i].id+'</p>');
		/* marker.addTo(map); */
		clusters.addLayer(marker);
	}
}