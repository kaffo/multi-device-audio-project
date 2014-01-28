// MDRS - JavaScript for Map
// Author - Gordon Adam
// Please Make sure to do debugging if changes are made

// Variables 
var myLatLng = new google.maps.LatLng(55.873657, -4.292474);
var map;
var mySound;
var syncSounds = [];


// Funuction to start map
function initialize() {
    
    // Sets the options on the map
    var mapOptions = {
	center: myLatLng,
	zoom: 3,
	mapTypeId: google.maps.MapTypeId.TERRAIN
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

	var latLngs = [
	    new google.maps.LatLng(37.772323, -122.214897),
	    new google.maps.LatLng(21.291982, -157.821856),
	    new google.maps.LatLng(-18.142599, 178.431),
	    new google.maps.LatLng(-27.46758, 153.027892)
	];


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
		var filePath;

		// iterator over each file
		for (var i=0; i<jsonArraySize; i++) {
		    
		    // sets the attributes of each file 
		    fileName = recordings[i].fields.file_name;
		    description = recordings[i].fields.description;
		    lngLat = new google.maps.LatLng(recordings[i].fields.lat, recordings[i].fields.lon);
		    filePath = recordings[i].fields.rec_file;
		    filePath = "../" + filePath;


		    // places a pin on the map at the lat and lng specified
		    pin = new google.maps.Marker({
			position: lngLat,
			map: map
		    });
		    

		    
		    // creates a listener for a click action on that pin
		    google.maps.event.addListener(pin, 'click', (function(pin, fileName, description, infoWindow, filePath) {
			return function() {

			    mySound = new buzz.sound(filePath);
			    // opens an info window with the title and description of that file
			    infoWindow.setContent('<div><h3>' + 
						  fileName + 
						  '</h3><p>' + 
						  description + 
						  '</p>' +
						  '<input id="play" type="button" value="Play" class="pure-button pure-button-primary" onclick="playAudio();"/>' +
						  '&nbsp' +
						  '<input id="pause" type="button" value="Pause" class="pure-button pure-button-primary" onclick="pauseAudio();" />' +
						  '&nbsp' +
						  '<input id="stop" type="button" value="Stop" class="pure-button pure-button-primary" onclick="stopAudio();" />' +
						  '</div>');
			    infoWindow.open(map, pin);
			    var route = drawRoute(latLngs);
			     
			     
			}
		    })(pin, fileName, description, infoWindow, filePath));
		}
	    }
	    
	);
    });
    
}

function playAudio() {
    mySound.play()
	.bind( "timeupdate", function() {
	    var timer = buzz.toTimer( this.getTime() );
	    document.getElementById( "timer" ).innerHTML = timer;
	});
}

function pauseAudio() {
    mySound.pause();
}

function stopAudio() {
    mySound.stop();
}

function playSync(){
    mySound.play();
}

function drawRoute(lngLatArray) {
    var route = new google.maps.Polyline({
	path: lngLatArray,
	geodesic: true,
	strokeColor: '#1F8DD6',
	strokeOpacity: 0.6,
	strokeWeight: 4
    })
    route.setMap(map);
    return route;
}

function deleteRoute(route) {
    route.setMap(null);
}
    
