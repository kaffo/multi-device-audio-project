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
    var pins = new Array();
    directionsDisplay = new google.maps.DirectionsRenderer();
    var mapOptions = {
	center: myLatLng2,
	zoom: 12,
	mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("content"),
			      mapOptions);
    var infowindow = new google.maps.InfoWindow;
    var marker = new google.maps.Marker({
	    position: myLatLng,
	    map: map,
	    title:"Glasgow University"
	});
    var infowindow2 = new google.maps.InfoWindow({
	    content: 'Change the zoom level',
	    position: myLatLng2
	});
    $.get(
	  "/webapp/getdata:" + swLat + ":" + swLng + ":" + neLat + ":" + neLng,
	  function(data) {
	      alert('page content: ' + data);
	  }
	  );


    var ll;
    var pin;
    for (var i=0; i<100; i++) {
	ll = new google.maps.LatLng((i), (i*i));
        pin = new google.maps.Marker({
		animation: google.maps.Animation.DROP,
		position: ll,
		map: map,
		icon: 'scripts/icon.png'
        });
	
	google.maps.event.addListener(pin, 'click', (function(pin, i) {
		    return function() {
			infowindow.setContent("Number: " + i);
			infowindow.open(map, pin);
		    }
		})(pin, i));
	pins[i] = pin;
    }
    infowindow2.open(map);
    //for (var i = 0; i<100; i++) {
    //    pins[i].
    google.maps.event.addListener(map, 'bounds_changed', function() {
	    var bounds = map.getBounds();
	    var sw = bounds.getSouthWest();
	    var ne = bounds.getNorthEast();
	    var swLat = sw.lat();
	    var swLng = sw.lng();
	    var neLat = ne.lat();
	    var neLng = ne.lng();
	    infowindow2.setPosition(map.center);
	    infowindow2.setContent("swLt[" + swLat +
				   "]<p>swLg[" + swLng +
				   "]<p>neLt[" + neLat +
				   "]<p>neLg[" + neLng + "]");
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
