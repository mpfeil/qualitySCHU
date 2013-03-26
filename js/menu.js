var chart;

$('#about').popover({placement:'bottom', trigger:'hover'})

$(".img-rounded").hover(
	function(){
		switch(this.getAttribute("id"))
		{
			case "overview":
				this.setAttribute('src', 'img/info_hover.png');
				break;
			case "tempHum":
				this.setAttribute('src', 'img/temphum_hover.png');
				break; 	
			case "no2":
				this.setAttribute('src', 'img/no2_hover.png');
				break;
			case "co":
				this.setAttribute('src', 'img/co_hover.png');
				break;
		}	
	},
	function(){
		switch(this.getAttribute("id"))
		{
			case "overview":
				this.setAttribute('src', 'img/info.svg');
				break;
			case "tempHum":
				this.setAttribute('src', 'img/temphum.svg');
				break; 	
			case "no2":
				this.setAttribute('src', 'img/no2.svg');
				break;
			case "co":
				this.setAttribute('src', 'img/co.svg');
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
		includeZero:false
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

$('#example1').multiselect({
	buttonClass: 'btn btn-small',
	onChange:function(element, checked){
        updateDiagram(element,checked);
    }
});

var options = {};
var wizard = $("#some-wizard").wizard(options);
$('#download').click(function(){
	wizard.show();	
});