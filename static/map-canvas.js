// MDRS - JavaScript for Map
// Author - Gordon Adam

// Variables 
var myLatLng = new google.maps.LatLng(55.873657, -4.292474);
var myLatLng2 = new google.maps.LatLng(55.88024, -4.30982);
var map;
var pins = new Array();

// Funuction to start map
function initialize() {

    // Sets the options on the map
    var mapOptions = {
	center: myLatLng2,
	zoom: 12,
	mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    // Calls the div on the webpage and binds the map to that div
    map = new google.maps.Map(document.getElementById("map-content"), mapOptions);

    boundsTest();
    markerArrayTest();
    retrieveData();
}


// Loads the Map
google.maps.event.addDomListener(window, 'load', initialize);

// Function to receive the data
function retrieveData() {
    $.get(
	  "/webapp/getdata:" + swLat + ":" + swLng + ":" + neLat + ":" + neLng,
	  function(data) {
	      alert('page content: ' + data);
	  }
    );
}

// Function to calculate the route
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

// Test function to test the possibility of storing markers in an array
function markerArrayTest() {
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
}

// Test function to test the possibility of retrieving the bounds of the map
function boundsTest() {
    var infowindow2 = new google.maps.InfoWindow({
	    content: 'Change the zoom level',
	    position: myLatLng2
	});
    infowindow2.open(map);

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
}
