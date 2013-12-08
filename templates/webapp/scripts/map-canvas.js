// JavaScript Document
var myLatLng = new google.maps.LatLng(55.873657, -4.292474);
var myLatLng2 = new google.maps.LatLng(55.88024, -4.30982);
var contentString = '<div id="content">'+
'<h1>Glasgow University</h1>'+
'</div>'+
'<p>Audio File by Gordon Adam</p>'+
'</div>'+
'</div>';
var directionsService = new google.maps.DirectionsService();
var directionsDisplay;
var map;
function initialize() {
	directionsDisplay = new google.maps.DirectionsRenderer();
    var mapOptions = {
    	center: myLatLng2,
    	zoom: 12,
    	mapTypeId: google.maps.MapTypeId.ROADMAP
	};
    map = new google.maps.Map(document.getElementById("content"),
    	mapOptions);
	var infowindow = new google.maps.InfoWindow({
		content: contentString
	});
	var marker = new google.maps.Marker({
		position: myLatLng,
		map: map,
		title:"Glasgow University"
	});
	google.maps.event.addListener(marker, 'click', function() {
		infowindow.open(map,marker);
		calcRoute();
	});
	directionsDisplay.setMap(map);
}
function calcRoute() {
	var request = {
		origin: myLatLng,
		destination: myLatLng2,
		travelMode: google.maps.TravelMode.WALKING
	};
	directionsService.route(request, function(result, status) {
		if(status == google.maps.DirectionsStatus.OK) {
			directionsDisplay.setDirections(result);
		}
	});
}
google.maps.event.addDomListener(window, 'load', initialize);
        