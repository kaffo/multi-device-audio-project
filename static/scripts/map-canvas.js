// MDRS - JavaScript for Map
// Author - Gordon Adam
// Please Make sure to do debugging if changes are made

// Global Variables 
var myLatLng = new google.maps.LatLng(55.873657, -4.292474);
var map;
var mySound;
var syncSounds = [];
var pins = {
    			pin: [],
    			fileName: [],
    			description: [],
    			latLng: [],
    			filePath: [],
    			route: []
			};
var numberOfPins;
 	

// Funuction to start map
function initialize() {
    
	// Uses HTML5 geolocation to track your location
    if(navigator.geolocation) {
    	navigator.geolocation.getCurrentPosition(function(position) {
      		var pos = new google.maps.LatLng(position.coords.latitude,
                                       position.coords.longitude);
      		map.setCenter(pos);
  		});
	}

	// Sets the options on the map
    var mapOptions = {
	disableDefaultUI: true,
	zoom: 15,
	mapTypeId: google.maps.MapTypeId.SATELLITE
    };

    // Calls the div on the webpage and binds the map to that div
    map = new google.maps.Map(document.getElementById("map-content"), mapOptions);
    
    google.maps.event.addListener(map, 'bounds_changed', function() {
		drawMarkers();
    });
}

// Loads the Map
google.maps.event.addDomListener(window, 'load', initialize);

// Function to draw the markers on the map
function drawMarkers() {
	
    // The bounds of the map on the screen
    var bounds = map.getBounds();
    var swLat = bounds.getSouthWest().lat();
    var swLng = bounds.getSouthWest().lng();
    var neLat = bounds.getNorthEast().lat();
    var neLng = bounds.getNorthEast().lng();
    
    // The attempt to query the database
    $.get(
		"/webapp/getdata:" + swLat + ":" + swLng + ":" + neLat + ":" + neLng,
	
		function(data) {
  
    		var recordings = eval("(" + data + ")"); // The recordings received from the database 
    		numberOfPins = recordings.length; // The number of recordings

    		var lat;
    		var lng;
    		
    		// Adds the lat & lon to the dictionary for each marker to be created with
    		for (var i=0; i<numberOfPins; i++) {

    			// The lat & lon
				lat = parseFloat(recordings[i].fields.lat);
				lng = parseFloat(recordings[i].fields.lon);

				// Creates the latlng object and adds it to the dictionary
				pins.latLng[i] = new google.maps.LatLng(lat,lng);
			}
    		
    		// Adds the marker and all relevant information to the dictionary
    		for (var i=0; i<numberOfPins; i++) {
				
				pins.fileName[i] = recordings[i].fields.file_name; // The name of the recording
				pins.description[i] = recordings[i].fields.description; // The description of the recording
				pins.filePath[i] = "../" + recordings[i].fields.rec_file; // The file path on the server to the audio recording
	
				// Places a marker on the map at the lat & lng specified
				pins.pin[i] = new google.maps.Marker({
	    			position: pins.latLng[i],
	    			icon: '/static/images/marker.png', // Loads the custom marker for each recording
	    			map: map
				});

    		}

    		// Adds a listener to each marker that activates on a mouse click
    		for (var i=0; i<numberOfPins; i++) {
    			addPinListenerOnClick(pins.pin[i], i, pins.fileName[i], pins.description[i], pins.latLng[i], pins.filePath[i])
    		}
    		
    	}
	);

}



function drawRouteOnMap(pinNum, coordArray) {
    var route = new google.maps.Polyline({ // Creates the polyline object
		path: coordArray,
		geodesic: true,
		strokeColor: '#1F8DD6', // Makes the route polyline pretty
		strokeOpacity: 0.6,
		strokeWeight: 4
    })
    route.setMap(map); // places the polyline on the map
    pin.route[pinNum] = route; // places it into the dictionary
}

function deleteRouteFromMap(route) {
    route.setMap(null);
}

// Function that queries the database for a route then attaches that route to a marker
function addRouteToMarker(pinNum, fileName, latLng) {
	var route = new Array(); // New array to store the co-ordinates of the route
	route[0] = latLng; // The first co-ordinates of the route are obviously the co-ordinates of the marker

    $.get("/webapp/getroute:" + fileName, //Queries the database for locations using the name of the file
		function(data) {
	       	var locations = eval("(" + data + ")"); // Parses the data returned from the database
	    	var locArraySize = locations.length; // Specifies the number of waypoints on the route
	       	for(var i = 0; i<locArraySize; i++) {
				route[i+1] = new google.maps.LatLng(locations[i].fields.lat, locations[i].fields.lon); // Adds all the lat & lon to an array
				var imageFile = locations[i].fields.image;
				if((locations[i].fields.image) != "") { // Checks if there is an image file for a point
		    		imagePin = new google.maps.Marker({ // If there is an image for a waypoint a marker is created for it here
						position: route[i+1],
						map: map
		    		});

		    		addImageWindow(imagePin, imageFile);	// Adds an image window for the marker
				}
			}
	    	drawRouteOnMap(pinNum, route); // Draws the route on the map
		}
	);
}

// Function that creates the window for the image
function addImageWindow(image_pin, image_file) {    
    var imageInfoWindow = new google.maps.InfoWindow(); // The window for the image is created
    google.maps.event.addListener(image_pin, 'click', (function(image_pin, image_file) { // The listener for a mouse click is added to the marker 
		return function() {
	    	imageInfoWindow.setContent('<div>' +
				  						'<img src=' + '"/static/data/' + image_file + '" alt="Failed to load"></img>' +
				  						'</div>');
	    	imageInfoWindow.open(map, image_pin);
	    }
    })(image_pin, image_file));
}

// A function to attach a listener for a mouse click on a marker
function addPinListenerOnClick(pin, pinNum, fileName, description, latLng, filePath) {
    var infoWindow = new google.maps.InfoWindow(); // Creates an empty Information Window

    // creates a listener for a click action on the marker
    google.maps.event.addListener(pin, 'click', (function(pin, pinNum, fileName, description, infoWindow, filePath, latLng) {
		return function() {
			drawInfoWindow(pin, fileName, description, filePath, infoWindow); // If the marker is clicked an info window is opened
	    	addRouteToMarker(pinNum, fileName, latLng); // If the marker is clicked the route is queried and drawn
		}
    })(pin, pinNum, fileName, description, infoWindow, filePath, latLng));
}

// A function that opens up an Info Window with all the details provided
function drawInfoWindow(pin, fileName, description, filePath, infoWindow) {

	// Loads a new sound using buzz
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
}

// A function to select all the markers on the map
function selectAll() {

	// Iterates over the dictionary of pins and calls the select marker function on each marker
	for(var i = 0; i < numberOfPins; i++) {
		selectMarker(pins.pin[i]);
	}
}

// A function that triggers a mock click on a single marker
function selectMarker(pin) {
    google.maps.event.trigger(pin, 'click', {});
}


// Set of Audio Functions
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
