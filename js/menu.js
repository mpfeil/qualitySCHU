$('#about').popover({placement:'bottom', trigger:'hover'})

$('#locateMe').popover({placement:'bottom', trigger:'hover'})

$('#locateMe').click("onclick",locateMe)

$('#overview').click(function(){
	$('#myModalLabel').text("Overview");
	$('#myTab a:first').tab('show');
	$('#myModal').modal("show");
})

$('#overview').hover(
	function(){
		this.setAttribute('src', 'img/info_white.png');
	},
	function(){
		this.setAttribute('src', 'img/info.svg');
	}
)

$('#tempHum').hover(function(){

})

$('#no').hover(function(){

})

$('#co2').hover(function(){

})


$('#tempHum').click(function(){
	$('#myModalLabel').text("Temperature / Humidity");
	$('#myTab a:first').tab('show');
	$('#myModal').modal("show");
})

$('#no').click(function(){
	$('#myModalLabel').text("Nitrogen Dioxide");
	$('#myTab a:first').tab('show');
	$('#myModal').modal("show");
})

$('#co2').click(function(){
	$('#myModalLabel').text("Carbon Monoxide");
	$('#myTab a:first').tab('show');
	$('#myModal').modal("show");
})