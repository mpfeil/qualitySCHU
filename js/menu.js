$('#about').popover({placement:'bottom', trigger:'hover'})

$('#locateMe').popover({placement:'bottom', trigger:'hover'})

$('#locateMe').click("onclick",locateMe)

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