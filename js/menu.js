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
		}
	}
)

$(".img-rounded").click(function(){
	var capture;
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
	$('#myModal').modal("show");
})

$('#myCarousel').carousel({interval:false});

var todaystart = Date.parse("today");
var todayend = Date.parse("next day");

$('#myModal').on('shown', function(){
	var diagramDataDummy = [];
	chart = new CanvasJS.Chart("chartContainer",
	{
		zoomEnabled: true,
		// title:{
		// 	// text: "Test Title",
		// 	fontSize: 30,
		// },
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

		data: diagramDataDummy, 
	});

	var dataSeriesDummy = { type: "line" };
	var dataPointsDummy = [];

	dataSeriesDummy.dataPoints = dataPointsDummy;
	diagramDataDummy.push(dataSeriesDummy);

    chart.render();

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
        $("td").empty();
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
});

$('.dropdown-menu').on('click', function(e){
	if($(this).hasClass('dropdown-menu-form')){
	    e.stopPropagation();
	}
});

var checkedValues = 0;
var elements = [];
$('.checkbox').on('click', function(e){
	if (e.target.checked) {
		checkedValues ++;
	}
	else {
		if (e.target.control)
		{
			checkedValues ++;
			checkedValues --;
		}
		else
		{
			checkedValues--;
		}
	}
	var caption = "";
	$('.btn-group input[type="checkbox"]').each(function(){
		if (this.checked) 
		{
			//Push checked elements to array if the not exsits in the array
			if (elements.indexOf($(this)[0].value) == -1 )
			{
				elements.push($(this)[0].value);	
			}
			if (caption == "")
			{
				caption = caption + $(this).context.parentElement.innerText;
			}
			else {
				caption = caption +","+$(this).context.parentElement.innerText;	
			}
		}
		else 
		{
			//Pop not selected elements from array if they exsits in the array
			if (elements.indexOf($(this)[0].value) > -1 )
			{
				elements.pop($(this)[0].value);	
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
	
	if (checkedValues == 2) {
		$('.btn-group input[type="checkbox"]').each(function(){
			if (!this.checked) 
			{
				this.disabled = true;
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
	buildDiagram();
});

var options = {};
var wizard = $("#some-wizard").wizard(options);
$('#download').click(function(){
	wizard.show();	
});