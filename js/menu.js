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
			case "lanuvCO":
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
			case "lanuvCO":
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

$('#myModal').on('shown', function(){

	chart = new CanvasJS.Chart("chartContainer",
    {
	    zoomEnabled: true,
	    legend:{
		    horizontalAlign:"center",
		    verticalAlign:"top"
        },
		axisX:{
		labelAngle: 30,
		},
		
		axisY :{
		includeZero:true
		},
		
		data: diagramData,

    });

    var dataSeries = { type: "line" };
	var dataPoints = [];
	
	dataSeries.dataPoints = dataPoints;
	diagramData.push(dataSeries);

    chart.render();

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
            'Today': ['today', 'today'],
            'Yesterday': ['yesterday', 'yesterday'],
            'Last 7 Days': [Date.today().add({ days: -6 }), 'today'],
            'Last 30 Days': [Date.today().add({ days: -29 }), 'today'],
            'This Month': [Date.today().moveToFirstDayOfMonth(), Date.today().moveToLastDayOfMonth()],
            'Last Month': [Date.today().moveToFirstDayOfMonth().add({ months: -1 }), Date.today().moveToFirstDayOfMonth().add({ days: -1 })]
        }
    },
    function(start, end) {
        $('#reportrangediagram span').html(start.toString('MMM. d, yyyy') + ' - ' + end.toString('MMM. d, yyyy'));
        $("td").empty();
        updateDiagram();
    });
    
    $('#reportrangetable span').html(Date.today().toString('MMM. d, yyyy') + ' - ' + Date.today().toString('MMM. d, yyyy'));
    $('#reportrangediagram span').html(Date.today().toString('MMM. d, yyyy') + ' - ' + Date.today().toString('MMM. d, yyyy'));
})

$('#myModal').on('hidden', function(){
	//TODO:Clear settings
});

$('.dropdown-menu').on('click', function(e){
	if($(this).hasClass('dropdown-menu-form')){
	    e.stopPropagation();
	}
});

var checkedValues = 0;
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
			if (caption == "")
			{
				caption = caption + $(this).context.parentElement.innerText;
				console.log(caption);
			}
			else {
				caption = caption +","+$(this).context.parentElement.innerText;	
				console.log(caption);
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
});

var options = {};
var wizard = $("#some-wizard").wizard(options);
$('#download').click(function(){
	wizard.show();	
});