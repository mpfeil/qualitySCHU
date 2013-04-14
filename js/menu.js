var chart;

$(".img-rounded").hover(
	function(){
		switch(this.getAttribute("id"))
		{
			case "overview":
				this.setAttribute('src', 'img/info_inverted.png');
				break;
			case "tempHum":
				this.setAttribute('src', 'img/temperature_inverted.png');
				break; 	
			case "no2":
				this.setAttribute('src', 'img/no2_inverted.png');
				break;
			case "co":
				this.setAttribute('src', 'img/co_inverted.png');
				break;
			case "lanuvTempHum":
				this.setAttribute('src', 'img/temperature_inverted.png');
				break; 	
			case "lanuvSO2":
				this.setAttribute('src', 'img/so2_inverted.png');
				break;
			case "lanuvO3":
				this.setAttribute('src', 'img/o3_inverted.png');
				break;
			case "lanuvNO":
				this.setAttribute('src', 'img/co_inverted.png');
				break;
			case "lanuvNO2":
				this.setAttribute('src', 'img/no2_inverted.png');
				break;
			case "lanuvDust":
				this.setAttribute('src', 'img/dust_inverted.png');
				break;
			case "lanuvWV":
				this.setAttribute('src', 'img/wind_velocity_inverted.png');
				break;
			case "download":
				this.setAttribute('src', 'img/download_inverted.png');
				break;
		}	
	},
	function(){
		switch(this.getAttribute("id"))
		{
			case "overview":
				this.setAttribute('src', 'img/info.png');
				break;
			case "tempHum":
				this.setAttribute('src', 'img/temperature.png');
				break; 	
			case "no2":
				this.setAttribute('src', 'img/no2.png');
				break;
			case "co":
				this.setAttribute('src', 'img/co.png');
				break;
			case "lanuvTempHum":
				this.setAttribute('src', 'img/temperature.png');
				break;
			case "lanuvSO2":
				this.setAttribute('src', 'img/so2.png');
				break;
			case "lanuvO3":
				this.setAttribute('src', 'img/o3.png');
				break;
			case "lanuvNO":
				this.setAttribute('src', 'img/co.png');
				break;
			case "lanuvNO2":
				this.setAttribute('src', 'img/no2.png');
				break;
			case "lanuvDust":
				this.setAttribute('src', 'img/dust.png');
				break;
			case "lanuvWV":
				this.setAttribute('src', 'img/wind_velocity.png');
				break;
			case "download":
				this.setAttribute('src', 'img/download.png');
				break;
		}
	}
)

$(".img-rounded.sensorbar").click(function(){
	if (!selectedService)
	{
		$('#hint').css("visibility", "visible");
		$('#hint').text("Please select a station on the map!");
	}
	else
	{
		if(selectedService == "lanuv")
		{
			$('#myModalLabel').append('<h3>'+lanuvStationen[checkedStation]["name"]+'</h3>');
		}
		if(selectedService == "cosmcosm")
		{
			$('#myModalLabel').append('<h3>'+results.title+'</h3>');
		}
		$('#myTab a:first').tab('show');
		$('#myModal').bigmodal("show");
	}
})

$('#download').click(function(){
	$('#downloadModal').modal("show");
})

$('#myCarousel').carousel({interval:false});

var todaystart = Date.parse("today");
var todayend = Date.parse("next day");

$('#myModal').on('shown', function(){
	
	if(selectedService == "lanuv")
	{
		$('#tablehead').children("tr").remove();
		$('#tablehead').append('<tr><th>Date</th><th>Humidity (%)</th><th>NO (µg/m<sup>3</sup>)</th><th>NO<sub>2</sub> (µg/m<sup>3</sup>)</th><th>Ozone (µg/m<sup>3</sup>)</th><th>Dust (µg/m<sup>3</sup>)</th><th>SO<sub>2</sub> (µg/m<sup>3</sup>)</th><th>Temperature (°C)</th><th>Wind velocity (m/s)</th></tr>');
		$('#multiselect-menu').children("li").remove();
		$('#multiselect-menu').append('<li><a><label class="checkbox"><input id="real" type="checkbox" value="Temperature">Temperature</input></label></a></li><li><a><label class="checkbox"><input id="real" type="checkbox" value="Humidity">Humidity</label></a></li><li><a><label class="checkbox"><input id="real" type="checkbox" value="nmono">NO</label></a></li><li><a><label class="checkbox"><input id="real" type="checkbox" value="NO2">NO<sub>2</sub></label></a></li><li><a><label class="checkbox"><input id="real" type="checkbox" value="wv">Wind velocity</label></a></li><li><a><label class="checkbox"><input id="real" type="checkbox" value="SO2">SO<sub>2</sub></label></a></li><li><a><label class="checkbox"><input id="real" type="checkbox" value="Ozone">Ozone</label></a></li><li><a><label class="checkbox"><input id="real" type="checkbox" value="PM10">Dust</label></a></li>');
		$('#home').children("div").remove();
		$('#home').append('<div class="row-fluid"><div class="span6"><div class="span4"><h4>Stationsprofile:</h4><h4>Stationtype:</h4><h4>Disko:</h4><h4>Address:</h4></div><div class="span4"><h6><a href="http://www.lanuv.nrw.de/luft/messorte/steckbriefe/'+checkedStation.toLowerCase()+'.htm" target="_blank">'+checkedStation+'</a></h6><h6><a href="http://www.lanuv.nrw.de/luft/immissionen/luqs/typen.htm" target="_blank">'+lanuvStationen[checkedStation]["type"]+'</a></h6><h6><a href="http://www.lanuv.nrw.de/luft/immissionen/disko-neu.htm" target="_blank">'+lanuvStationen[checkedStation]["disko"]+'</a></h6><address>'+lanuvStationen[checkedStation]["address"]+'<br>'+lanuvStationen[checkedStation]["plz"]+'</address></div></div><div class="span6"><img src="http://www.lanuv.nrw.de/luft/messorte/bilder/bild-'+checkedStation.toLowerCase()+'.jpg" alt="some_text" width="100%" height="100%"></div></div>');
		if(lanuvStationen[checkedStation]["disko"] == 1)
		{
			$('#tableTabContent').attr('data-toggle', '');
			$('#tableTab').addClass('disabled');
			$('#diagramTabContent').attr('data-toggle', '');
			$('#diagramTab').addClass('disabled');
		}
		else
		{
			$('#myTab a[href="#diagram"]').on('click', function(){
				$('#modalFooter').css('visibility', 'visible');
				// console.log($('#checkTemp'));
				// buildDiagram();
				// buildCaption();
				// checkOptions();
			})

			$('#myTab a[href="#table"]').on('click', function(){
				$('#modalFooter').css('visibility', 'visible');
			})
		}
		initCheckboxes();
	}
	if(selectedService == "cosmcosm")
	{
		$('#tablehead').children("tr").remove();
		$('#tablehead').append('<tr><th>Date</th><th>CO (ppm)</th><th>Humidity (%)</th><th>NO<sub>2</sub> (ppm)</th><th>Temperature (°C)</th></tr>');
		$('#multiselect-menu').children("li").remove();
		$('#multiselect-menu').append('<li><a><label class="checkbox"><input id="checkTemp" type="checkbox" value="Temperature">Temperature</input></label></a></li><li><a><label class="checkbox"><input id="checkHum" type="checkbox" value="Humidity">Humidity</label></a></li><li><a><label class="checkbox"><input id="real" type="checkbox" value="CO">CO</label></a></li><li><a><label class="checkbox"><input id="real" type="checkbox" value="NO2">NO<sub>2</sub></label></a></li>');
		$('#home').children("div").remove();
		$('#home').append('<div class="row-fluid"><div class="span6"><div class="span4"><h4>Description:</h4><h4>Creator:</h4><h4>Cosm feed:</h4><h4>Status:</h4><h4>Domain:</h4><h4>Exposure:</h4><h4>Elevation:</h4><h4>Tags:</h4></div><div class="span4"><h4>'+results["description"]+'</h4><h4><a href="'+results["creator"]+'" target="_blank">AirQualityEgg</a></h4><h4><a href="https://cosm.com/feeds/'+results["id"]+'" target="_blank">'+results["id"]+'</a></h4><h4>live</h4><h4>'+results["location"]["domain"]+'</h4><h4>'+results["location"]["exposure"]+'</h4><h4>35m</h4><h4><span style="display:inline;" class="label label-info">'+results["tags"][0]+'</span> <span style="display:inline;" class="label label-info">'+results["tags"][1]+'</span></h4></div></div><div class="span6"></div></div>');
		initCheckboxes();

		$('#myTab a[href="#diagram"]').on('click', function(){
			$('#modalFooter').css('visibility', 'visible');

			// console.log($('#checkTemp'));
			// buildDiagram();
			// buildCaption();
			// checkOptions();
		})

		$('#myTab a[href="#table"]').on('click', function(){
			$('#modalFooter').css('visibility', 'visible');
		})
	}

	chart = new CanvasJS.Chart("chartContainer",
	{
		zoomEnabled: true,
		axisX:{
			labelAngle: -30,
			gridColor: "Silver",
			tickColor: "silver",
			valueFormatString: "DD-MMM-hh:mm",
		},
		theme: "theme1",
		axisY: {
			gridColor: "Silver",
			tickColor: "silver",
			titleFontColor: "LightSkyBlue",
			title: "",
		},
		axisY2:{ 
			title: "",
			gridColor: "Silver",
			tickColor: "silver",
    		titleFontColor: "LightSeaGreen",
			},

		data: diagramDataDummy 
	});
	
	chart.render();

	var diagramDataDummy = [];
	var dataSeriesDummy = { type: "line" };
	var dataPointsDummy = [];

	dataSeriesDummy.dataPoints = dataPointsDummy;
	diagramDataDummy.push(dataSeriesDummy);

	$('#reportrangetable').daterangepicker(
    {
        ranges: {
            'Today': ['today', 'next day'],
            'Yesterday': ['yesterday', 'today'],
            'Last 7 Days': [Date.today().add({ days: -6 }), 'today'],
            'Last 30 Days': [Date.today().add({ days: -29 }), 'today'],
            'This Month': [Date.today().moveToFirstDayOfMonth(), Date.today().moveToLastDayOfMonth()],
            'Last Month': [Date.today().moveToFirstDayOfMonth().add({ months: -1 }), Date.today().moveToFirstDayOfMonth().add({ days: -1 })]
        }
    },
    function(start, end) {
        $('#reportrangetable span').html(start.toString('MMM. d, yyyy') + ' - ' + end.toString('MMM. d, yyyy'));
        $('.trbody').empty();
        updateTable(start,end);
    });
    
    $('#reportrangediagram').daterangepicker(
    {
        ranges: {
            'Today': ['today', 'next day'],
            'Yesterday': ['yesterday', 'today'],
            'Last 7 Days': [Date.today().add({ days: -6 }), 'today'],
            'Last 30 Days': [Date.today().add({ days: -29 }), 'today'],
            'This Month': [Date.today().moveToFirstDayOfMonth(), Date.today().moveToLastDayOfMonth()],
            'Last Month': [Date.today().moveToFirstDayOfMonth().add({ months: -1 }), Date.today().moveToFirstDayOfMonth().add({ days: -1 })]
        }
    },
    function(start, end) {
    	todaystart = start;
    	todayend = end;
        $('#reportrangediagram span').html(start.toString('MMM. d, yyyy') + ' - ' + end.toString('MMM. d, yyyy'));
        buildDiagram();
    });
  
  	$('#reportrangetable span').html(Date.today().toString('MMM. d, yyyy') + ' - ' + Date.parse('next day').toString('MMM. d, yyyy'));
  	$('#reportrangediagram span').html(Date.today().toString('MMM. d, yyyy') + ' - ' + Date.parse('next day').toString('MMM. d, yyyy'));  
    // $('#reportrangetable span').html(Date.today().toString('MMM. d, yyyy') + ' - ' + Date.today().toString('MMM. d, yyyy'));
    // $('#reportrangediagram span').html(Date.today().toString('MMM. d, yyyy') + ' - ' + Date.today().toString('MMM. d, yyyy'));
})

function buildDiagram()
{
	if (elements != "")
	{
		addToDiagram(elements,todaystart,todayend);		
	}
}

$('#myModal').on('hidden', function(){
	elements = [];
	checkedValues = 0;
	$('#tablebody').children('tr').remove();
	$('#modalFooter').css('visibility', 'hidden');
	$('#tableTabContent').attr('data-toggle', 'tab');
	$('#tableTab').removeClass('disabled');
	$('#diagramTabContent').attr('data-toggle', 'tab');
	$('#diagramTab').removeClass('disabled');
	$('#myModalLabel').children('h3').remove();
	$('#home').children("div").remove();
});

$('.dropdown-menu').on('click', function(e){
	if($(this).hasClass('dropdown-menu-form')){
	    e.stopPropagation();
	}
});

function buildCaption()
{
	var caption="";
	$('.btn-group input[type="checkbox"]').each(function(){
		if (this.checked) 
		{
			if (caption == "")
			{
				caption = caption + $(this).context.defaultValue;
			}
			else 
			{
				caption = caption +","+$(this).context.defaultValue;	
			}
		}
		if (caption == "")
		{
			$('#dropdown-multiselect').text("None selected ").append('<span class="caret"></span>');	
		}
		else
		{
			$('#dropdown-multiselect').text(caption+" ").append('<span class="caret"></span>');	
		}
	});	
}

var echeckbox;
var elements = [];
var checkedValues = 0;
function initCheckboxes()
{
	$('.checkbox').on('click', function(e){
	
		if(e.target.checked)
		{
			checkedValues ++;
			elements.push(e.target.defaultValue.toLowerCase());
		}
		else
		{
			if(e.target.control)
			{
				checkedValues ++;
				checkedValues --;
			}
			else
			{
				checkedValues --;
				elements.splice(elements.indexOf(e.target.defaultValue.toLowerCase()),1);	
			}
		}
	
		buildCaption();
		checkOptions();
		buildDiagram();
	});	
}

$('#myTab a[href="#home"]').on('click', function(){
	$('#modalFooter').css('visibility', 'hidden');
})

function checkOptions()
{
	if (checkedValues == 2) {
		$('.btn-group input[type="checkbox"]').each(function(){
			if (!this.checked) 
			{
				this.disabled = true;
			}
			else
			{
				this.disabled = false;	
			}
		});
	}
	else
	{
		$('.btn-group input[type="checkbox"]').each(function(){
			if (this.disabled) 
			{
				this.disabled = false;
			}
		});	
	}
}

var options = {};
var selectedServiceToDownload;
var selectedProceduresToDownload;
var selectedObservedProperties;
var selectedStartdateToDownload;
var selectedEnddateToDownload;
var downloadURLJSON;
var wizard = $("#downloadWizard").wizard(options);

wizard.el.find(".wizard-success .download-more-data").click(function() {
	wizard.reset();

});

wizard.el.find(".wizard-success .im-done").click(function() {
	wizard.reset().close();
});

$('#download').click(function(){
	$("#service").select2({
    	placeholder: "Select a service",
    	allowClear: true
	});	
	wizard.show();	
});

wizard.on("reset",function(wizard){
	selectedServiceToDownload = "";
	selectedProceduresToDownload = [];
	selectedObservedProperties = [];
	$('#errorSection').addClass('hide');
	$('#procedures').select2('val','');
	$('#obsProp').select2('val','');
	$('#procedures').children('optgroup').remove();
	$('#obsProp').children('option').remove();
})

wizard.on("submit", function(wizard) {
	downloadURLJSON = "http://giv-geosoft2d.uni-muenster.de/istsos/wa/istsos/services/"+selectedServiceToDownload+"/operations/getobservation/offerings/temporary/procedures/"+selectedProceduresToDownload+"/observedproperties/"+selectedObservedProperties+"/eventtime/"+selectedStartdateToDownload+"/"+selectedEnddateToDownload+"";
	$('#hrefJSON').attr('href',downloadURLJSON);

	downloadURLXML = "http://giv-geosoft2d.uni-muenster.de/istsos/"+selectedServiceToDownload+"?service=SOS&request=GetObservation&offering=temporary&procedure="+selectedProceduresToDownload+"&srsName=4326&observedProperty="+selectedObservedProperties+"&responseFormat=text/xml&service=SOS&version=1.0.0&eventTime="+selectedStartdateToDownload+"/"+selectedEnddateToDownload+"";
	$('#hrefXML').attr('href',downloadURLXML);

	downloadURLPlain = "http://giv-geosoft2d.uni-muenster.de/istsos/"+selectedServiceToDownload+"?service=SOS&request=GetObservation&offering=temporary&procedure="+selectedProceduresToDownload+"&srsName=4326&observedProperty="+selectedObservedProperties+"&responseFormat=text/plain&service=SOS&version=1.0.0&eventTime="+selectedStartdateToDownload+"/"+selectedEnddateToDownload+"";
	$('#hrefPlain').attr('href',downloadURLPlain);

	downloadURLXJSON = "http://giv-geosoft2d.uni-muenster.de/istsos/"+selectedServiceToDownload+"?service=SOS&request=GetObservation&offering=temporary&procedure="+selectedProceduresToDownload+"&srsName=4326&observedProperty="+selectedObservedProperties+"&responseFormat=text/x-json&service=SOS&version=1.0.0&eventTime="+selectedStartdateToDownload+"/"+selectedEnddateToDownload+"";
	$('#hrefXJSON').attr('href',downloadURLXJSON);

	downloadURLSensorML = "http://giv-geosoft2d.uni-muenster.de/istsos/"+selectedServiceToDownload+"?service=SOS&request=GetObservation&offering=temporary&procedure="+selectedProceduresToDownload+"&srsName=4326&observedProperty="+selectedObservedProperties+"&responseFormat=text/xml;subtype='sensorML/1.0.0'&service=SOS&version=1.0.0&eventTime="+selectedStartdateToDownload+"/"+selectedEnddateToDownload+"";
	$('#hrefSensorML').attr('href',downloadURLSensorML);

	setTimeout(function() {
		wizard.trigger("success");
		wizard.hideButtons();
		wizard._submitting = false;
		wizard.showSubmitCard("success");
	}, 2000);
});

function somethingSelected(card)
{
	ret = {
		status: true
	};

	if($("#service").select2("val") == "")
	{
		ret.status = false;
		ret.msg = "Nothing selected!";
	}
	else
	{
		selectedServiceToDownload = $("#service").select2("val");
	}
	
	return ret;
}

function somethingSelected2(card)
{
	ret = {
		status: true
	};
	if($("#procedures").select2("val") == "")
	{
		$('#errorSection').removeClass('hide');
		ret.status = false;
	}
	else
	{
		$('#errorSection').addClass('hide');
		selectedProceduresToDownload = $("#procedures").select2("val");
	}

	return ret;
}

function somethingSelected3(card)
{
	ret = {
		status: true
	};
	if($('#obsProp').select2("val") == "")
	{
		$('#errorSectionObsProp').removeClass('hide');
		ret.status = false;
	}
	else
	{
		$('#errorSectionObsProp').addClass('hide');
		selectedObservedProperties = $("#obsProp").select2("val");
	}

	return ret;
}

function loadAvailableStations(card)
{
	$("#procedures").select2({
    	placeholder: "Select some procedures",
    	allowClear: true
	});
	if(selectedServiceToDownload == "lanuv")
	{
		$('#procedures').children('optgroup').remove();
		$('#procedures').children('option').remove();
		var trafficOptGroup = "<optgroup label='Traffic'>";
		var backgroundOptGroup = "<optgroup label='Background'>";
		var industryOptGroup = "<optgroup label='Industry'>";

		for(station in lanuvStationen)
		{
			if(lanuvStationen[station]["disko"] == 0)
			{
				if(lanuvStationen[station]["type"].toLowerCase() == 'verkehr' )
				{
					trafficOptGroup = trafficOptGroup + "<option value="+lanuvStationen[station]["kuerzel"]+">"+lanuvStationen[station]["name"]+"</option>";
				}
				if(lanuvStationen[station]["type"].toLowerCase() == 'hintergrund')
				{
					backgroundOptGroup = backgroundOptGroup + "<option value="+lanuvStationen[station]["kuerzel"]+">"+lanuvStationen[station]["name"]+"</option>";
				}
				if(lanuvStationen[station]["type"].toLowerCase() == 'industrie')
				{
					industryOptGroup = industryOptGroup + "<option value="+lanuvStationen[station]["kuerzel"]+">"+lanuvStationen[station]["name"]+"</option>";
				}	
			}
		}	
		
		trafficOptGroup = trafficOptGroup + "</optgroup>";
		backgroundOptGroup = backgroundOptGroup + "</optgroup>";
		industryOptGroup = industryOptGroup + "</optgroup>";

		$('#procedures').append(trafficOptGroup);
		$('#procedures').append(backgroundOptGroup);
		$('#procedures').append(industryOptGroup);
	}
	if(selectedServiceToDownload == "cosmcosm")
	{
		$('#procedures').children('optgroup').remove();
		$('#procedures').children('option').remove();

		jQuery.ajax({
			url: 'http://giv-geosoft2d.uni-muenster.de/istsos/wa/istsos/services/cosmcosm/procedures/operations/getlist',
	        type: 'get',
	        dataType: "json",
	        success:function(data3){
	        	for(var i = 0; i < data3.data.length; i++)
	        	{
	        		$('#procedures').append('<option value='+data3.data[i]["name"]+'>'+data3.data[i]["name"]+'</option>');
	        	}
	        }
	    });
	}
}

function loadObservedProperties(card)
{
	$('#obsProp').children('option').remove();
	$("#obsProp").select2({
    	placeholder: "Select some observed properties",
    	allowClear: true
	});
	if(selectedServiceToDownload == "lanuv")
	{
		$("#obsProp").append('<option value="urn:ogc:def:parameter:x-istsos:1.0:meteo:air:temperature">Temperature</option><option value="urn:ogc:def:parameter:x-istsos:1.0:meteo:air:humidity">Humidity</option><option value="urn:ogc:def:parameter:x-istsos:1.0:meteo:air:nmono">Nitrogen Monoxide</option><option value="urn:ogc:def:parameter:x-istsos:1.0:meteo:air:no2">Nitrogen Dioxide</option><option value="urn:ogc:def:parameter:x-istsos:1.0:meteo:air:so2">Sulfur Dioxide</option><option value="urn:ogc:def:parameter:x-istsos:1.0:meteo:air:ozone">Ozone</option><option value="urn:ogc:def:parameter:x-istsos:1.0:meteo:air:pm10">Dust</option><option value="urn:ogc:def:parameter:x-istsos:1.0:meteo:air:wv">Wind velocity</option>');
	}
	if(selectedServiceToDownload == "cosmcosm")
	{
		$("#obsProp").append('<option value="urn:ogc:def:parameter:x-istsos:1.0:meteo:air:temperature">Temperature</option><option value="urn:ogc:def:parameter:x-istsos:1.0:meteo:air:humidity">Humidity</option><option value="urn:ogc:def:parameter:x-istsos:1.0:meteo:air:co">Carbon Monoxide</option><option value="urn:ogc:def:parameter:x-istsos:1.0:meteo:air:no2">Nitrogen Dioxide</option>');
	}
}

function loadTimeFrame(card)
{
	$('#reportrangeDownload').daterangepicker(
    {
        ranges: {
            'Today': ['today', 'next day'],
            'Yesterday': ['yesterday', 'today'],
            'Last 7 Days': [Date.today().add({ days: -6 }), 'today'],
            'Last 30 Days': [Date.today().add({ days: -29 }), 'today'],
            'This Month': [Date.today().moveToFirstDayOfMonth(), Date.today().moveToLastDayOfMonth()],
            'Last Month': [Date.today().moveToFirstDayOfMonth().add({ months: -1 }), Date.today().moveToFirstDayOfMonth().add({ days: -1 })]
        }
    },
    function(start, end) {
    	selectedStartdateToDownload = start.toString('yyyy-MM-ddTHH:mm:ss');
		selectedStartdateToDownload = selectedStartdateToDownload + getTz(start.getTimezoneOffset());
		selectedEnddateToDownload = end.toString('yyyy-MM-ddTHH:mm:ss');
		selectedEnddateToDownload = selectedEnddateToDownload + getTz(end.getTimezoneOffset());
        $('#reportrangeDownload span').html(start.toString('MMM. d, yyyy') + ' - ' + end.toString('MMM. d, yyyy'));
    });

    $('#reportrangeDownload span').html(Date.today().toString('MMM. d, yyyy') + ' - ' + Date.parse('next day').toString('MMM. d, yyyy'));
}