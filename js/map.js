var map = L.map('map').setView([51.966667, 7.633333], 6);
var data;
var data2;
var selectedService;
var checkedStation;
var selectedMarker;

//Data Array for Diagram. Contains the single dataSeries
// var diagramData = [];
// var dataPoints = [];

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
	cosm.setKey("tT0xUa9Yy24qPaZXDgJi-lDmf3iSAKxvMEhJWDBleHpMWT0g");
	clusters.fire('data:loading');
	loadCOSM();
});

function loadCOSM()
{
	console.log("loadCOSM");
	cosm.request({type:"GET",url:"http://api.cosm.com/v2/feeds?q=aqe&content=summary&status=live&per_page=150", done: addAQE, fail:function(data){
			console.log("fail");
			console.log(data);
			loadLANUV();
			$('#hint').css("visibility", "visible");
			$('#hint').append("COSM data not loaded <a href='' onclick='add'>Reload?</a>");
	}});
}

function loadLANUV()
{
	jQuery.ajax({
        url: 'http://www.lanuv.nrw.de/luft/temes/stationen.js',
        type: 'get',
        dataType: 'script',
        success:addLANUV
     });
}

function addLANUV()
{
	for(station in stationen)
	{
		marker = new L.Marker(new L.LatLng(stationen[station].latitude,stationen[station].longitude),{icon:lanuv, title:station});
		clusters.addLayer(marker);
	}

	clusters.fire('data:loaded');
}

clusters.on('beforeDataLoad',   function() { layer.fire('data:loading'); });
clusters.on('dataLoadComplete', function() { layer.fire('data:loaded'); });

clusters.on('click', function(e){
	$('#hint').css("visibility", "hidden");
	cosm.stop('#tempForm');
	cosm.stop('#humForm');
	cosm.stop('#no2Form');
	cosm.stop('#coForm');
	if (selectedMarker!= null && isNaN(selectedMarker.options.title)) {selectedMarker.setIcon(lanuv)} else if (selectedMarker!= null && Number(selectedMarker.options.title)) {selectedMarker.setIcon(aqe)};
	checkedStation = e.layer.options.title;
	selectedMarker = e.layer;
	if(isNaN(checkedStation))
	{
		eventtime_start = Date.today().setTimeToNow().addHours(-2).toString('yyyy-MM-ddTHH:59:00')+getTz(Date.today().setTimeToNow().addHours(-2).getTimezoneOffset());
		eventtime_end = Date.today().setTimeToNow().toString('yyyy-MM-ddTHH:00:00')+getTz(Date.today().setTimeToNow().getTimezoneOffset());

		$('.carousel').carousel(1);
		selectedMarker.setIcon(lanuv_selected);
		selectedService = "lanuv";
		jQuery.ajax({
			url: 'http://giv-geosoft2d.uni-muenster.de/istsos/wa/istsos/services/'+selectedService+'/operations/getobservation/offerings/temporary/procedures/'+checkedStation+'/observedproperties/urn:ogc:def:parameter:x-istsos:1.0:meteo:air:wv,urn:ogc:def:parameter:x-istsos:1.0:meteo:air:temperature,urn:ogc:def:parameter:x-istsos:1.0:meteo:air:so2,urn:ogc:def:parameter:x-istsos:1.0:meteo:air:pm10,urn:ogc:def:parameter:x-istsos:1.0:meteo:air:ozone,urn:ogc:def:parameter:x-istsos:1.0:meteo:air:nmono,urn:ogc:def:parameter:x-istsos:1.0:meteo:air:no2,urn:ogc:def:parameter:x-istsos:1.0:meteo:air:humidity/eventtime/'+eventtime_start+'/'+eventtime_end+'?_dc=1363547035889',
	        type: 'get',
	        dataType: "json",
	        success:function(data3){
	        	$('#lanuvTempForm').text(function(){
	        		return (isNaN(data3.data[0].result.DataArray.values[0][13])) ? "-" : new Number(data3.data[0].result.DataArray.values[0][13]).toFixed(1);
	        	});
	        	$('#lanuvHumForm').text(function(){
	        		return (isNaN(data3.data[0].result.DataArray.values[0][1])) ? "-" : new Number (data3.data[0].result.DataArray.values[0][1]).toFixed(1);
	        	});
	        	$('#lanuvNO2Form').text(function(){
	        		return (isNaN(data3.data[0].result.DataArray.values[0][5])) ? "-" : new Number(data3.data[0].result.DataArray.values[0][5]).toFixed(1);
	        	});
	        	$('#lanuvNOForm').text(function(){
	        		return (isNaN(data3.data[0].result.DataArray.values[0][3])) ? "-" : new Number(data3.data[0].result.DataArray.values[0][3]).toFixed(1);
	        	});
	        	$('#lanuvSO2Form').text(function(){
	        		return (isNaN(data3.data[0].result.DataArray.values[0][11])) ? "-" : new Number(data3.data[0].result.DataArray.values[0][11]).toFixed(1);
	        	});
	        	$('#lanuvDustForm').text(function(){
	        		return (isNaN(data3.data[0].result.DataArray.values[0][9])) ? "-" : new Number(data3.data[0].result.DataArray.values[0][9]).toFixed(1);
	        	});
	        	$('#lanuvO3Form').text(function(){
	        		return (isNaN(data3.data[0].result.DataArray.values[0][7])) ? "-" : new Number(data3.data[0].result.DataArray.values[0][7]).toFixed(1);
	        	});
	        	$('#lanuvWVForm').text(function(){
	        		return (isNaN(data3.data[0].result.DataArray.values[0][15])) ? "-" : new Number(data3.data[0].result.DataArray.values[0][15]).toFixed(1);
	        	});
	        }
		});
	}
	else
	{
		selectedMarker.setIcon(aqe_selected);
		selectedService = "cosmcosm";
		var tempStream = "";
		var humStream = "";
		var no2Stream = "";
		var coStream = "";
		cosm.request({type:"GET",url:"http://api.cosm.com/v2/feeds/"+e.layer.options.title+".json", done: function(result){
			console.log(result);
			for (var i = 0; i < result.datastreams.length; i++)
			{
				var id = result.datastreams[i]["id"].toLowerCase();
				if(id.match(/temperature/g))
				{	
					tempStream = result.datastreams[i]["id"];
				}
				if(id.match(/humidity/g))
				{	
					humStream = result.datastreams[i]["id"];
				}
				if(id.match(/co_[0-9]/g))
				{	
					coStream = result.datastreams[i]["id"];
				}
				if(id.match(/no2_[0-9]/g))
				{	
					no2Stream = result.datastreams[i]["id"];
				}
			}
			$('#tempForm').cosm('live', {feed: e.layer.options.title, datastream:tempStream});
			$('#humForm').cosm('live', {feed: e.layer.options.title, datastream:humStream});
			$('#no2Form').cosm('live', {feed: e.layer.options.title, datastream:no2Stream});
			$('#coForm').cosm('live', {feed: e.layer.options.title, datastream:coStream});
		}});
		$('.carousel').carousel(0);
	}
})

function addAQE(results)
{
	data = results.results;
	
	// console.log(data.length)
	
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
	loadLANUV();
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
	var url = "";
	if (selectedService == "cosmcosm")
	{
		url = 'http://giv-geosoft2d.uni-muenster.de/istsos/wa/istsos/services/'+selectedService+'/operations/getobservation/offerings/temporary/procedures/'+checkedStation+'/observedproperties/urn:ogc:def:parameter:x-istsos:1.0:meteo:air:co,urn:ogc:def:parameter:x-istsos:1.0:meteo:air:temperature,urn:ogc:def:parameter:x-istsos:1.0:meteo:air:no2,urn:ogc:def:parameter:x-istsos:1.0:meteo:air:humidity/eventtime/'+eventtime_start+'/'+eventtime_end+'?_dc=1363547035889' 
	}
	if (selectedService == "lanuv")
	{
		url = 'http://giv-geosoft2d.uni-muenster.de/istsos/wa/istsos/services/'+selectedService+'/operations/getobservation/offerings/temporary/procedures/'+checkedStation+'/observedproperties/urn:ogc:def:parameter:x-istsos:1.0:meteo:air:wv,urn:ogc:def:parameter:x-istsos:1.0:meteo:air:temperature,urn:ogc:def:parameter:x-istsos:1.0:meteo:air:so2,urn:ogc:def:parameter:x-istsos:1.0:meteo:air:pm10,urn:ogc:def:parameter:x-istsos:1.0:meteo:air:ozone,urn:ogc:def:parameter:x-istsos:1.0:meteo:air:nmono,urn:ogc:def:parameter:x-istsos:1.0:meteo:air:no2,urn:ogc:def:parameter:x-istsos:1.0:meteo:air:humidity/eventtime/'+eventtime_start+'/'+eventtime_end+'?_dc=1363547035889'
	} 

	var td = new Array();
	if (url != "")
	{
		jQuery.ajax({
	        url: url,
	        type: 'get',
	        dataType: "json",
	        success:function(data3){
	        	data2 = data3;
	        	console.log(data2);
	        	for(var i = 0; i < data2.data[0].result.DataArray.values.length; i++)
	        	{
	        		newtablerow = "";
	        		td = data2.data[0].result.DataArray.values[i];
	        		tempdate = td[0].split("+");
	        		tempdate = tempdate[0]+"+02:00";
					date = new Date(tempdate).toString('dd.MM.yyyy HH:mm:ss');
		        	for(var j = 2; j < td.length; j = j + 2)
		        	{
			        	if(td[j]=="100")
			        	{
				        	newtablerow = newtablerow + '<td class="tdwarning">'+td[j-1]+'</td>';
			        	}
			        	else if(td[j]=="101")
			        	{
				        	newtablerow = newtablerow + '<td class="tderror">'+td[j-1]+'</td>';
			        	}
			        	else if(td[j]=="102")
			        	{
				        	newtablerow = newtablerow + '<td class="tdsuccess">'+td[j-1]+'</td>';
			        	}
			        	else
			        	{
				        	newtablerow = newtablerow + '<td>-</td>';
			        	}
		        	}
		        	$('#tablebody').append('<tr class="trbody"><td>'+date+'</td>'+newtablerow+'</tr>');
	        	}
	        }
	    });
	}
}

function addToDiagram(elems,start,end)
{
	console.log("Start drawing diagram");
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
        success:function(data3){
		    var data = []; var dataSeries = { type: "line"};
		    var dataPoints = [];

		    if(elems.length == 2)
		    {
				var dataSeries2 = { type: "line", axisYType: "secondary", markerType: "circle",};
		    	var dataPoints2 = [];		    	
		    }

		    for(var i = 0; i < data3.data[0].result.DataArray.values.length; i++)
		    {
		    	td = data3.data[0].result.DataArray.values[i];
		    	var yValue = (isNaN(parseFloat(td[1]))) ? null : parseFloat(td[1]);
		    	var dataPointColor = (td[2] == 100) ? "#f89406" : (td[2] == 101) ? "#b94a48" : (td[2] == 102) ? "#468847" : "" ;
		    	dateTime = new Date(td[0]);
		        dataPoints.push({
		          	x: dateTime,
		          	y: yValue,
		          	markerSize:1,
		          	markerColor: dataPointColor              
		        });
		        if(td.length > 3)
		        {
		        	var yValue2 = (isNaN(parseFloat(td[3]))) ? null : parseFloat(td[3]);
		        	var dataPointColor2 = (td[4] == 100) ? "#f89406" : (td[2] == 101) ? "#b94a48" : (td[2] == 102) ? "#468847" : "" ;
		        	dataPoints2.push({
			          	x: dateTime,
			          	y: yValue2,
			          	markerType: "circle",
			          	markerSize:1,
			          	markerColor: dataPointColor2               
			        });

		        }	
		    }
		  	
		    dataSeries.markerType = "circle";
		    dataSeries.dataPoints = dataPoints;
		    dataSeries.color = "LightSkyBlue";
		    chart.options.axisY.title = elems[0];
		    data.push(dataSeries);

		    if(elems.length == 2)
		    {
		    	dataSeries2.dataPoints = dataPoints2;
		     	data.push(dataSeries2);
		     	dataSeries2.color = "LightSeaGreen";
		     	chart.options.axisY2.title = elems[1]; 
		    }

		    chart.options.data = data;
		    chart.render();
        }
    });
}