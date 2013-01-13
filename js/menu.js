$('#about').popover({placement:'bottom'})

$('#overview').click(function(){
	$('#myModalLabel').text("Overview");
	$('#myTab a:first').tab('show');
	$('#myModal').modal("show");
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