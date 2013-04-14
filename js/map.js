var map = L.map('map').setView([51.966667, 7.633333], 6); // global leaflet map element
var selectedService; // current selected service (cosm or lanuv)
var checkedStation; // current selected station (aqe or lanuv station)
var selectedMarker; // current selected leaflet marker
var results; // contains all data of the current selected aqe
var lanuvStationen; // contains all lanuv stations
var spinner = new Spinner(); // global loading spinner object

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

var marker = new L.Marker([50,7]); // default marker
var clusters = new L.MarkerClusterGroup({showCoverageOnHover: false}); // default clustergroup

//Basemap
L.tileLayer('http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/997/256/{z}/{x}/{y}.png', {
	maxZoom: 18,
	attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>'
}).addTo(map);

map.addLayer(clusters);

//If the document is ready start to load the cosm data
$(document).ready(function($){
	cosm.setKey("tT0xUa9Yy24qPaZXDgJi-lDmf3iSAKxvMEhJWDBleHpMWT0g");
	clusters.fire('data:loading');
	loadCOSM();
});

//This function loads the AQE data from COSM.
//If it fails load LANUV data and give feedback to the user.
function loadCOSM()
{
	console.log("loadCOSM");
	cosm.request({type:"GET",url:"http://api.cosm.com/v2/feeds?q=aqe&content=summary&status=live&per_page=150", done: addAQE, fail:function(data){
			console.log("fail");
			console.log(data);
			loadLANUV();
			$('#hint').css("visibility", "visible"); //feedback element for the user
			$('#hint').append("COSM data not loaded <a href='' onclick='add'>Reload?</a>"); //hint caption and possibility to reload the data
	}});
}

//Success function of the COSM request. First create a marker and then 
//adds it to the defualt cluster group.
function addAQE(results) {
	data = results.results;
	
	console.log(data.length)
	
	for (var i = 0; i < data.length; i++) {
		try {
			marker = new L.Marker(new L.LatLng(data[i].location.lat,data[i].location.lon),{icon:aqe, title:data[i].id});
			clusters.addLayer(marker);
		} catch(err) {
			console.log(err);
		}	
	}
	loadLANUV();
}

//Adds the offical stationen.js script of LANUV to our website.
function loadLANUV() {
	jQuery.ajax({
        url: 'http://www.lanuv.nrw.de/luft/temes/stationen.js',
        type: 'get',
        dataType: 'script',
        success:addLANUV
     });
}

//Success function of loadLANUV function. First create a marker and add it to the default clustergroup.
function addLANUV() {
	lanuvStationen = stationen; //sets all available stations for later use
	for (station in stationen) {
		marker = new L.Marker(new L.LatLng(stationen[station].latitude,stationen[station].longitude),{icon:lanuv, title:station});
		clusters.addLayer(marker);
	}
	clusters.fire('data:loaded');
}

clusters.on('beforeDataLoad',   function() { layer.fire('data:loading'); });
clusters.on('dataLoadComplete', function() { layer.fire('data:loaded'); });

//Click handler for the clustergroup and the containing markers.
clusters.on('click', function(e) {
	$('#hint').css("visibility", "hidden");
	
	//Stop the COSM live feed
	cosm.stop('#tempForm'); 
	cosm.stop('#humForm');
	cosm.stop('#no2Form');
	cosm.stop('#coForm');

	//Check what marker type is selected. If selectedMarker title is not a number a LANUV stations is selected else if it is a number a AQE is selected.
	if (selectedMarker!= null && isNaN(selectedMarker.options.title)) {
		selectedMarker.setIcon(lanuv);
	} else if (selectedMarker!= null && Number(selectedMarker.options.title)) {
		selectedMarker.setIcon(aqe);
	}
	checkedStation = e.layer.options.title; //save the checkedStation
	selectedMarker = e.layer; //save the selected leaflet marker
	
	//thats the LANUV part
	if (isNaN(checkedStation)) {

		//set start and endtime to query the last observed properties
		eventtime_start = Date.today().setTimeToNow().addHours(-2).toString('yyyy-MM-ddTHH:59:00')+getTz(Date.today().setTimeToNow().addHours(-2).getTimezoneOffset());
		eventtime_end = Date.today().setTimeToNow().toString('yyyy-MM-ddTHH:00:00')+getTz(Date.today().setTimeToNow().getTimezoneOffset());

		$('.carousel').carousel(1); //switch over to the lanuv sensorbar
		selectedMarker.setIcon(lanuv_selected);
		selectedService = "lanuv";
		jQuery.ajax({
			url: 'http://giv-geosoft2d.uni-muenster.de/istsos/wa/istsos/services/'+selectedService+'/operations/getobservation/offerings/temporary/procedures/'+checkedStation+'/observedproperties/urn:ogc:def:parameter:x-istsos:1.0:meteo:air:wv,urn:ogc:def:parameter:x-istsos:1.0:meteo:air:temperature,urn:ogc:def:parameter:x-istsos:1.0:meteo:air:so2,urn:ogc:def:parameter:x-istsos:1.0:meteo:air:pm10,urn:ogc:def:parameter:x-istsos:1.0:meteo:air:ozone,urn:ogc:def:parameter:x-istsos:1.0:meteo:air:nmono,urn:ogc:def:parameter:x-istsos:1.0:meteo:air:no2,urn:ogc:def:parameter:x-istsos:1.0:meteo:air:humidity/eventtime/'+eventtime_start+'/'+eventtime_end+'?_dc=1363547035889',
	        type: 'get',
	        dataType: "json",
	        success:function(data3) {
	        	//set the last observed values to the sensorbar
	        	$('#lanuvTempForm').text(function(){
	        		return (isNaN(data3.data[0].result.DataArray.values[0][13])) ? "-" : new Number(data3.data[0].result.DataArray.values[0][13]).toFixed(1);
	        	});
	        	$('#lanuvHumForm').text(function() {
	        		return (isNaN(data3.data[0].result.DataArray.values[0][1])) ? "-" : new Number (data3.data[0].result.DataArray.values[0][1]).toFixed(1);
	        	});
	        	$('#lanuvNO2Form').text(function() {
	        		return (isNaN(data3.data[0].result.DataArray.values[0][5])) ? "-" : new Number(data3.data[0].result.DataArray.values[0][5]).toFixed(1);
	        	});
	        	$('#lanuvNOForm').text(function() {
	        		return (isNaN(data3.data[0].result.DataArray.values[0][3])) ? "-" : new Number(data3.data[0].result.DataArray.values[0][3]).toFixed(1);
	        	});
	        	$('#lanuvSO2Form').text(function() {
	        		return (isNaN(data3.data[0].result.DataArray.values[0][11])) ? "-" : new Number(data3.data[0].result.DataArray.values[0][11]).toFixed(1);
	        	});
	        	$('#lanuvDustForm').text(function() {
	        		return (isNaN(data3.data[0].result.DataArray.values[0][9])) ? "-" : new Number(data3.data[0].result.DataArray.values[0][9]).toFixed(1);
	        	});
	        	$('#lanuvO3Form').text(function() {
	        		return (isNaN(data3.data[0].result.DataArray.values[0][7])) ? "-" : new Number(data3.data[0].result.DataArray.values[0][7]).toFixed(1);
	        	});
	        	$('#lanuvWVForm').text(function() {
	        		return (isNaN(data3.data[0].result.DataArray.values[0][15])) ? "-" : new Number(data3.data[0].result.DataArray.values[0][15]).toFixed(1);
	        	});
	        }
		});
	} else { // thats the COSM part
		selectedMarker.setIcon(aqe_selected);
		selectedService = "cosmcosm";
		var tempStream = "";
		var humStream = "";
		var no2Stream = "";
		var coStream = "";
		cosm.request({type:"GET",url:"http://api.cosm.com/v2/feeds/"+e.layer.options.title+".json", done: function(result){
			results = result;
			console.log(result);

			//Check available datastreams for feed
			for (var i = 0; i < result.datastreams.length; i++) {
				var id = result.datastreams[i]["id"].toLowerCase();
				if (id.match(/temperature/g)) {	//just grab the temperature stream...
					tempStream = result.datastreams[i]["id"];
				}
				if (id.match(/humidity/g)) { //just grab the humidity stream...
					humStream = result.datastreams[i]["id"];
				}
				if (id.match(/co_[0-9]/g)) { //just grab one CO stream...
					coStream = result.datastreams[i]["id"];
				}
				if (id.match(/no2_[0-9]/g)) { //just grab one no2 stream...
					no2Stream = result.datastreams[i]["id"];
				}
			}
			//... and set it to the COSM sensorbar
			$('#tempForm').cosm('live', {feed: e.layer.options.title, datastream:tempStream});
			$('#humForm').cosm('live', {feed: e.layer.options.title, datastream:humStream});
			$('#no2Form').cosm('live', {feed: e.layer.options.title, datastream:no2Stream});
			$('#coForm').cosm('live', {feed: e.layer.options.title, datastream:coStream});
		}});
		$('.carousel').carousel(0); //switch to the COSM sensorbar
	}
})

//Convert the Timezone offset from minutes to hours
function getTz(offset) {
	offset = offset / -60;
	if (offset>=0 && offset <10) {
		strTz = "+0"+String(offset);
	} else if (offset>=0 && offset >= 10) {
		strTz = String(offset);	
	} else if (offset<=0 && offset <10) {
		strTz = "-0"+String(offset);	
	} else if (offset<=0 && offset >10) {
		strTz = String(offset);	
	}

	return strTz;
}

//This function fills up the table with values
function updateTable(start,end) {
	eventtime_start = start.toString('yyyy-MM-ddTHH:mm:ss');
	eventtime_start = eventtime_start + getTz(start.getTimezoneOffset());
	eventtime_end = end.toString('yyyy-MM-ddTHH:mm:ss');
	eventtime_end = eventtime_end + getTz(end.getTimezoneOffset());
	var url = "";
	if (selectedService == "cosmcosm") {
		url = 'http://giv-geosoft2d.uni-muenster.de/istsos/wa/istsos/services/'+selectedService+'/operations/getobservation/offerings/temporary/procedures/'+checkedStation+'/observedproperties/urn:ogc:def:parameter:x-istsos:1.0:meteo:air:co,urn:ogc:def:parameter:x-istsos:1.0:meteo:air:temperature,urn:ogc:def:parameter:x-istsos:1.0:meteo:air:no2,urn:ogc:def:parameter:x-istsos:1.0:meteo:air:humidity/eventtime/'+eventtime_start+'/'+eventtime_end+'?_dc=1363547035889' 
	}
	if (selectedService == "lanuv") {
		url = 'http://giv-geosoft2d.uni-muenster.de/istsos/wa/istsos/services/'+selectedService+'/operations/getobservation/offerings/temporary/procedures/'+checkedStation+'/observedproperties/urn:ogc:def:parameter:x-istsos:1.0:meteo:air:wv,urn:ogc:def:parameter:x-istsos:1.0:meteo:air:temperature,urn:ogc:def:parameter:x-istsos:1.0:meteo:air:so2,urn:ogc:def:parameter:x-istsos:1.0:meteo:air:pm10,urn:ogc:def:parameter:x-istsos:1.0:meteo:air:ozone,urn:ogc:def:parameter:x-istsos:1.0:meteo:air:nmono,urn:ogc:def:parameter:x-istsos:1.0:meteo:air:no2,urn:ogc:def:parameter:x-istsos:1.0:meteo:air:humidity/eventtime/'+eventtime_start+'/'+eventtime_end+'?_dc=1363547035889'
	} 

	var td = new Array();
	if (url != "") {
		spinner.spin(document.getElementById('dataTable'));
		jQuery.ajax({
	        url: url,
	        type: 'get',
	        dataType: "json",
	        success:function(data3) {
	        	data2 = data3;
	        	console.log(data2);
	        	for (var i = 0; i < data2.data[0].result.DataArray.values.length; i++) {
	        		newtablerow = "";
	        		td = data2.data[0].result.DataArray.values[i];
	        		tempdate = td[0].split("+");
	        		tempdate = tempdate[0]+"+02:00";
					date = new Date(tempdate).toString('dd.MM.yyyy HH:mm:ss');
					//Check the data quality and depending on that set the color
		        	for (var j = 2; j < td.length; j = j + 2) {
			        	if(td[j]=="100") {
				        	newtablerow = newtablerow + '<td class="tdwarning">'+td[j-1]+'</td>';
			        	} else if(td[j]=="101") {
				        	newtablerow = newtablerow + '<td class="tderror">'+td[j-1]+'</td>';
			        	} else if(td[j]=="102") {
				        	newtablerow = newtablerow + '<td class="tdsuccess">'+td[j-1]+'</td>';
			        	} else {
				        	newtablerow = newtablerow + '<td>-</td>';
			        	}
		        	}
		        	$('#tablebody').append('<tr class="trbody"><td>'+date+'</td>'+newtablerow+'</tr>');
	        	}
	        	spinner.stop();
	        }
	    });
	}
}

//This function fills up the diagram
function addToDiagram(elems,start,end) {
	spinner.spin(document.getElementById('chartContainer'));
	query = "";
	
	//Build query string
	for (var i = 0; i < elems.length; i++) {
		if (query == "") {
			query = "urn:ogc:def:parameter:x-istsos:1.0:meteo:air:" + elems[i];	
		} else {
			query = query + ",urn:ogc:def:parameter:x-istsos:1.0:meteo:air:" + elems[i];	
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
        success:function(data3) {

        	console.log(data3);

        	if (data3.data[0].result.DataArray.length == 0) {
        		$('#dataAvailable').css('visibility','visible');
        	} else {
        		$('#dataAvailable').css('visibility','hidden');
        		var data = []; // array that contains the dataseries which should be visualized in the diagram
			    var dataSeries = { type: "line", lineThickness: 3}; //setup a line chart
			    var dataPoints = []; //datapoints which build up the line

			    //If there are two selected observed properties setup a second line chart
			    if(elems.length == 2) {
					var dataSeries2 = { type: "line", lineThickness: 3, axisYType: "secondary", markerType: "circle",};
			    	var dataPoints2 = [];		    	
			    }

			    //Build up the datapoints
			    for (var i = 0; i < data3.data[0].result.DataArray.values.length; i++) {
			    	td = data3.data[0].result.DataArray.values[i];
			    	var yValue = (isNaN(parseFloat(td[1]))) ? null : parseFloat(td[1]);
			    	var dataPointColor = (td[2] == 100) ? "#f89406" : (td[2] == 101) ? "#b94a48" : (td[2] == 102) ? "#468847" : "" ;
			    	var dataPointType = (td[2] == 100) ? "circle" : (td[2] == 101) ? "cross" : (td[2] == 102) ? "circle" : "" ;
			    	var dataPointSize = (td[2] == 100) ? "3" : (td[2] == 101) ? "5" : (td[2] == 102) ? "3" : "" ;
			    	tempdate = td[0].split("+");
		        	tempdate = tempdate[0]+"+02:00";
			    	dateTime = new Date(tempdate);
			        dataPoints.push({
			          	x: dateTime,
			          	y: yValue,
			          	markerSize: dataPointSize,
			          	markerColor: dataPointColor,
			          	markerType: dataPointType              
			        });

			        //Builds up the datapoint array if there are two selected observed properties
			        if(td.length > 3) {
			        	var yValue2 = (isNaN(parseFloat(td[3]))) ? null : parseFloat(td[3]);
			        	var dataPointColor2 = (td[4] == 100) ? "#f89406" : (td[2] == 101) ? "#b94a48" : (td[2] == 102) ? "#468847" : "" ;
			        	var dataPointType2 = (td[2] == 100) ? "circle" : (td[2] == 101) ? "cross" : (td[2] == 102) ? "circle" : "" ;
			    		var dataPointSize2 = (td[2] == 100) ? "3" : (td[2] == 101) ? "5" : (td[2] == 102) ? "3" : "" ;

			        	dataPoints2.push({
				          	x: dateTime,
				          	y: yValue2,
				          	markerSize: dataPointSize2,
			          		markerColor: dataPointColor2,
			          		markerType: dataPointType2              
				        });
			        }	
			    }

			    //Setup the styles for the single line charts
			    dataSeries.markerType = "circle"; 
			    dataSeries.dataPoints = dataPoints;
			    dataSeries.color = "LightSkyBlue";

			    //Setup the Axis labels
			    chart.options.axisX.title = "Time in UTC"+getTz(dateTime.getTimezoneOffset());
			    chart.options.axisY.title = data3.data[0].result.DataArray.field[1].name +" ("+ data3.data[0].result.DataArray.field[1].uom+")";
			    data.push(dataSeries);

			    //Setup and put all stuff together for the second line chart
			    if (elems.length == 2) {
			    	dataSeries2.dataPoints = dataPoints2;
			     	data.push(dataSeries2);
			     	dataSeries2.color = "LightSeaGreen";
			     	chart.options.axisY2.title = data3.data[0].result.DataArray.field[3].name +" ("+ data3.data[0].result.DataArray.field[3].uom+")"; 
			    }

			    //Pass all the data to the chart and render it.
			    chart.options.data = data;
			    chart.render();

			    spinner.stop();	
        	}
        }
    });
}