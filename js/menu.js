var chart;

$('#about').popover({placement:'bottom', trigger:'click'})
$('#use').popover({placement:'bottom', trigger:'click'})

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
		}
	}
)

$(".img-rounded").click(function(){
	var capture;
	if (!selectedService)
	{
		$('#hint').css("visibility", "visible");
		$('#hint').text("Please select a station on the map!");
	}
	else
	{
		switch(this.getAttribute("id"))
		{
			case "overview":
				capture = "Overview";
				console.log(checkedStation);
				break;
			case "tempHum":
				capture = "Temperature / Humidity";
				break;
			case "no2":
				capture = "Nitrogen Dioxide";
				break;
			case "co":
				capture = "Carbon Monoxide";
				break;
		}
		$('#myModalLabel').text(capture);
		$('#myTab a:first').tab('show');
		// $('#myModal').modal("show");
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
		$('#multiselect-menu').append('<li><a><label class="checkbox"><input id="real" type="checkbox" value="temperature">Temperature</input></label></a></li><li><a><label class="checkbox"><input id="real" type="checkbox" value="humidity">Humidity</label></a></li><li><a><label class="checkbox"><input id="real" type="checkbox" value="nmono">NO</label></a></li><li><a><label class="checkbox"><input id="real" type="checkbox" value="no2">NO<sub>2</sub></label></a></li><li><a><label class="checkbox"><input id="real" type="checkbox" value="wv">Wind velocity</label></a></li><li><a><label class="checkbox"><input id="real" type="checkbox" value="so2">SO<sub>2</sub></label></a></li><li><a><label class="checkbox"><input id="real" type="checkbox" value="ozone">Ozone</label></a></li><li><a><label class="checkbox"><input id="real" type="checkbox" value="pm10">Dust</label></a></li>');
		initCheckboxes();
	}
	if(selectedService == "cosmcosm")
	{
		$('#tablehead').children("tr").remove();
		$('#tablehead').append('<tr><th>Date</th><th>CO (ppm)</th><th>Humidity (%)</th><th>NO<sub>2</sub> (ppm)</th><th>Temperature (°C)</th></tr>');
		$('#multiselect-menu').children("li").remove();
		$('#multiselect-menu').append('<li><a><label class="checkbox"><input id="real" type="checkbox" value="temperature">Temperature</input></label></a></li><li><a><label class="checkbox"><input id="real" type="checkbox" value="humidity">Humidity</label></a></li><li><a><label class="checkbox"><input id="real" type="checkbox" value="co">CO</label></a></li><li><a><label class="checkbox"><input id="real" type="checkbox" value="no2">NO<sub>2</sub></label></a></li>');
		initCheckboxes();

	}

	chart = new CanvasJS.Chart("chartContainer",
	{
		zoomEnabled: true,
		axisX:{
			labelAngle: -30,
			gridColor: "Silver",
			tickColor: "silver",
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
            'Today': ['today', 'today'],
            'Yesterday': ['yesterday', 'yesterday'],
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
            'Yesterday': ['yesterday', 'yesterday'],
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
    
    $('#reportrangetable span').html(Date.today().toString('MMM. d, yyyy') + ' - ' + Date.today().toString('MMM. d, yyyy'));
    $('#reportrangediagram span').html(Date.today().toString('MMM. d, yyyy') + ' - ' + Date.today().toString('MMM. d, yyyy'));
})

function buildDiagram()
{
	if (elements != "")
	{
		addToDiagram(elements,todaystart,todayend);		
	}
}

$('#myModal').on('hidden', function(){
	//TODO:Clear settings
	elements = [];
	checkedValues = 0;
	$('#tablebody').children('tr').remove();
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
				caption = caption + $(this).context.parentElement.innerText;
			}
			else {
				caption = caption +","+$(this).context.parentElement.innerText;	
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

var checkedValues = 0;
var elements = [];
function initCheckboxes()
{
	$('.checkbox').on('click', function(e){
	console.log(e);
	
	toElement = e.toElement;
	if (e.target.checked) 
	{
		checkedValues ++;
		elements.push(toElement.value);
	}
	else 
	{
		checkedValues--;
		elements.pop(toElement.value);
		// if (toElement.control.checked)
		// checkedValues--;
		// elements.pop(toElement.value);
		// if (e.target.control)
		// {
		// 	checkedValues ++;
		// 	checkedValues --;
		// 	elements.push(toElement.value);
		// }
		// else
		// {
			// checkedValues--;
		// }
	}
	buildCaption();
	//checkOptions();
	var caption = "";
	
	// if (checkedValues == 2) {
	// 	$('.btn-group input[type="checkbox"]').each(function(){
	// 		if (!this.checked) 
	// 		{
	// 			this.disabled = true;
	// 		}
	// 		else
	// 		{
	// 			this.disabled = false;	
	// 		}
	// 	});
	// }
	// else
	// {
	// 	$('.btn-group input[type="checkbox"]').each(function(){
	// 		if (this.disabled) 
	// 		{
	// 			this.disabled = false;
	// 		}
	// 	});	
	// }
	buildDiagram();
});	
}


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
}

var options = {};
var wizard = $("#some-wizard").wizard(options);
$('#download').click(function(){
	wizard.show();	
});