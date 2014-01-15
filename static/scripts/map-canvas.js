// MDRS - JavaScript for Map
// Author - Gordon Adam

// Variables 
var myLatLng = new google.maps.LatLng(55.873657, -4.292474);
var map;

// Funuction to start map
function initialize() {
    
    // Sets the options on the map
    var mapOptions = {
	center: myLatLng,
	zoom: 3,
	mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    // Calls the div on the webpage and binds the map to that div
    map = new google.maps.Map(document.getElementById("map-content"), mapOptions);
    
    boundsTest();
}


// Loads the Map
google.maps.event.addDomListener(window, 'load', initialize);


// Test function to test the possibility of retrieving the bounds of the map
function boundsTest() {
    
    // adds a listener to the map that is activated when the bounds change
    google.maps.event.addListener(map, 'bounds_changed', function() {

	// fetches the bounds of the map at a specific time until they change again
	var bounds = map.getBounds();
	var swLat = bounds.getSouthWest().lat();
	var swLng = bounds.getSouthWest().lng();
	var neLat = bounds.getNorthEast().lat();
	var neLng = bounds.getNorthEast().lng();

	// attempts to get data from the backend
	$.get(
	    "/webapp/getdata:" + swLat + ":" + swLng + ":" + neLat + ":" + neLng,

	    function(data) {

		// map objects
		var infoWindow = new google.maps.InfoWindow();
		var pin;

		// json data variables
		var jsonArraySize = data.length;
		var recordings = eval("(" + data + ")");
		
		// individual file attributes
		var fileName;
		var description;
		var lngLat;

		// iterator over each file
		for (var i=0; i<jsonArraySize; i++) {
		    
		    // sets the attributes of each file 
		    fileName = recordings[i].fields.file_name
		    description = recordings[i].fields.description
		    lngLat = new google.maps.LatLng(recordings[i].fields.lat, recordings[i].fields.lon);

		    // places a pin on the map at the lat and lng specified
		    pin = new google.maps.Marker({
			position: lngLat,
			map: map
		    });

		    // creates a listener for a click action on that pin
		    google.maps.event.addListener(pin, 'click', (function(pin, fileName, description, infoWindow) {
			return function() {
			    
			    // opens an info window with the title and description of that file
			    infoWindow.setContent('<div><h3>' + fileName + '</h3><p>' + description + '</p></div>');
			    infoWindow.open(map, pin);
			}
		    })(pin, fileName, description, infoWindow));
		}
	    }
	    
	);
    });
    
}


    

