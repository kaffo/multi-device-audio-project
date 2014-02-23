// MDRS - JavaScript for Map
// Author - Gordon Adam
// Please Make sure to do debugging if changes are made

// Global Variables 
var myLatLng = new google.maps.LatLng(55.873657, -4.292474);
var homeMarker;
var map;
var pins = {
    			pin: [],
    			fileID: [],
    			fileName: [],
    			description: [],
    			startTime: [],
    			endTime: [],
    			latLng: [],
    			filePath: [],
    			route: [],
    			infoWindow: [],
    			image: [],
    			selected: []
			};
var selectedPins = {
    			pin: [],
    			fileName: [],
    			fileID: [],
    			description: [],
    			startTime: [],
    			endTime: [],
    			latLng: [],
    			filePath: [],
    			route: [],
    			infoWindow: [],
    			image: [],
    			selected: []
			};
var numberOfPins;
var myOptions = {
                    content: ".",
                    maxWidth: 250,
                    minHeight: 100,
                    maxHeight: 300,
                    shadowStyle: 1,
                    padding: 0,
                    backgroundColor: '#252424',
                    borderRadius: 8,
                    arrowSize: 7,
                    borderWidth: 1,
                    borderColor: '#454444',
                    disableAutoPan: true,
                    hideCloseButton: false,
                    arrowPosition: 25,
                    backgroundClassName: 'phoney',
                    arrowStyle: 2,
            		map: map
                };

var homeDotImage = {
	url: '/static/images/home.png',
	anchor: new google.maps.Point(14,14)
};

var pinImage = {
	url: '/static/images/marker.png'
};

var selectedPinImage = {
	url: '/static/images/marker_selected.png'
};

var selectedStartTime = 0;
var selectedEndTime = 0;
 	

// Funuction to start map
function initialize() {

	// Sets the options on the map
    var mapOptions = {
		disableDefaultUI: true,
		zoom: 6,
		center: myLatLng,
		mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    
	// Uses HTML5 geolocation to track your location
    if(navigator.geolocation) {
    	navigator.geolocation.getCurrentPosition(function(position) {
      		var pos = new google.maps.LatLng(position.coords.latitude,
                                       position.coords.longitude);
      		map.setCenter(pos);
      		map.setZoom(17);
      		var image = {
      			url: '/static/images/home.png',
      			anchor: new google.maps.Point(14,14)
      		}

      		var homeMarker = new google.maps.Marker({
				position: pos,
				icon: homeDotImage, // Loads the custom marker for each recording
				map: map
			});
  		});
	}
/*
		
*/
    // Calls the div on the webpage and binds the map to that div
    map = new google.maps.Map(document.getElementById("map-content"), mapOptions);

    
    google.maps.event.addListener(map, 'idle', function() {
		drawMarkers()
    });
	
/*
	Still to be implemented properly

    alert(map.getCenter() + "<br />" + myLatLng);

    if(map.getCenter().equals(myLatLng)) {
    	var locationWindow = new google.maps.infoWindow();
		locationWindow.setContent("Please update your browser or use google chrome for location services");
		locationWindow.open(map);
	}
*/
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
    $.getJSON(
		"/webapp/getdata:" + swLat + ":" + swLng + ":" + neLat + ":" + neLng,
	
		function(data) {

			for(var i = 0; i < pins.pin.length; i++) {
					if(selectedPins.fileID.indexOf(pins.fileID[i]) != -1) {
						var popIndex = selectedPins.fileID.indexOf(pins.fileID[i]);
						selectedPins.fileID.splice(popIndex, 1);
						selectedPins.latLng.splice(popIndex, 1);
						selectedPins.fileName.splice(popIndex, 1);
						selectedPins.description.splice(popIndex, 1);
						selectedPins.startTime.splice(popIndex, 1);
						selectedPins.endTime.splice(popIndex, 1);
						selectedPins.filePath.splice(popIndex, 1);
						selectedPins.route.splice(popIndex, 1);
						selectedPins.infoWindow.splice(popIndex, 1);
						selectedPins.image.splice(popIndex, 1);
						selectedPins.selected.splice(popIndex, 1);
					}
					selectedPins.fileID.push(pins.fileID[i]);
					selectedPins.latLng.push(pins.latLng[i]);
					selectedPins.fileName.push(pins.fileName[i]);
					selectedPins.description.push(pins.description[i]);
					selectedPins.startTime.push(pins.startTime[i]);
					selectedPins.endTime.push(pins.endTime[i]);
					selectedPins.filePath.push(pins.filePath[i]);
					selectedPins.route.push(pins.route[i]);
					selectedPins.infoWindow.push(pins.infoWindow[i]);
					selectedPins.image.push(pins.image[i]);
					selectedPins.selected.push(pins.selected[i]);
			}
  
    		var recordings = data; // The recordings received from the database 
    		numberOfPins = recordings.length; // The number of recordings

    		var lat;
    		var lng;			

    		
    		// Adds the marker and all relevant information to the dictionary
    		for (var i=0; i<numberOfPins; i++) {

    			if(pins.pin[i] != null) {
    				pins.pin[i].setMap(null);
    			}

    			if(selectedPins.fileID.indexOf(recordings[i].pk) != -1) {
    				var index = selectedPins.fileID.indexOf(recordings[i].pk);
    				pins.fileID[i] = selectedPins.fileID[index];
    				pins.latLng[i] = selectedPins.latLng[index];
					pins.fileName[i] = selectedPins.fileName[index];
					pins.description[i] = selectedPins.description[index];
					pins.startTime[i] = selectedPins.startTime[index];
					pins.endTime[i] = selectedPins.endTime[index];
					pins.filePath[i] = selectedPins.filePath[index];
					pins.route[i] = selectedPins.route[index];
					pins.infoWindow[i] = selectedPins.infoWindow[index];
					pins.image[i] = selectedPins.image[index];
					pins.selected[i] = selectedPins.selected[index];
    			} else {

    				lat = parseFloat(recordings[i].fields.lat);
					lng = parseFloat(recordings[i].fields.lon);

					pins.fileID[i] = recordings[i].pk;
					pins.latLng[i] = new google.maps.LatLng(lat,lng);
					pins.fileName[i] = recordings[i].fields.file_name; // The name of the recording
					pins.description[i] = recordings[i].fields.description; // The description of the recording
					pins.startTime[i] = (new Date(recordings[i].fields.start_time)).getTime();
					pins.endTime[i] = (new Date(recordings[i].fields.end_time)).getTime();
					pins.filePath[i] = "../" + recordings[i].fields.rec_file; // The file path on the server to the audio recording
					pins.route[i] = null;
					pins.infoWindow[i] = new InfoBubble(myOptions);
					pins.image[i] = pinImage;
					pins.selected[i] = false;
				}
					
					// Places a marker on the map at the lat & lng specified
				pins.pin[i] = new google.maps.Marker({
	    			position: pins.latLng[i],
	    			icon: pins.image[i], // Loads the custom marker for each recording
	    			map: map
				});
			


    		}
    		// Adds a listener to each marker that activates on a mouse click
    		for (var i=0; i<numberOfPins; i++) {
    			addPinListenerOnClick(i, pins.fileID[i], pins.fileName[i], pins.description[i], pins.latLng[i], pins.filePath[i])
    		}
    	}
	);

}



function drawRouteOnMap(pinNum, coordArray) {
	if(pins.route[pinNum] == null)
    	var route = new google.maps.Polyline({ // Creates the polyline object
			path: coordArray,
			geodesic: true,
			strokeColor: '#1F8DD6', // Makes the route polyline pretty
			strokeOpacity: 0.6,
			strokeWeight: 4
    	})
    	route.setMap(map); // places the polyline on the map
    	pins.route[pinNum] = route; // places it into the dictionary
}

function deleteRouteFromMap(pinNum) {
	if(pins.route[pinNum] != null) {
    	pins.route[pinNum].setMap(null);
    	pins.route[pinNum] = null;
    }
}

// Function that queries the database for a route then attaches that route to a marker
function addRouteToMarker(pinNum, fileID, latLng) {
	var route = new Array(); // New array to store the co-ordinates of the route
	route[0] = latLng; // The first co-ordinates of the route are obviously the co-ordinates of the marker

    $.getJSON("/webapp/getroute:" + fileID, //Queries the database for locations using the name of the file
		function(data) {
	       	var locations = data; // Parses the data returned from the database
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
			// Draws the route on the map
	    	if(locArraySize>0) {
	    		drawRouteOnMap(pinNum, route);
	    	} 
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
function addPinListenerOnClick(pinNum, fileID, fileName, description, latLng, filePath) {

    // creates a listener for a click action on the marker
    google.maps.event.addListener(pins.pin[pinNum], 'click', (function(pinNum, fileID, fileName, description, filePath, latLng) {
		return function() {
			if(!pins.selected[pinNum]) {
				pins.pin[pinNum].setIcon(selectedPinImage);
				pins.image[pinNum] = selectedPinImage;
				pins.selected[pinNum] = true;
				if(!pins.infoWindow[pinNum].isOpen()) {
					drawInfoWindow(pinNum, fileName, description, filePath); // If the marker is clicked an info window is opened
				}
	    		addRouteToMarker(pinNum, fileID, latLng); // If the marker is clicked the route is queried and drawn
	    	}
	    	else {
				pins.pin[pinNum].setIcon(pinImage);
				pins.image[pinNum] = pinImage;
				pins.selected[pinNum] = false;
				deleteRouteFromMap(pinNum); // If the marker is clicked an info window is opened
	    	}
		}
    })(pinNum, fileID, fileName, description, filePath, latLng));
}

// A function that opens up an Info Window with all the details provided
function drawInfoWindow(pinNum, fileName, description, filePath, infoWindow) {

	// Loads a new sound using buzz
    mySound = new buzz.sound(filePath);

    // opens an info window with the title and description of that file
    pins.infoWindow[pinNum].setContent('<div style="margin-left:20px;"">' +
                    					'<h2>' + 
			  							fileName + 
			  							'</div>' +
			  							'</h2>' +
			  							'<div style="margin-left:20px; margin-right:20px; max-height:100px; overflow:auto;">' +
			  							'<p style="line-height:normal; margin-right:3px">' +
			  							description +
			  							'</div>' +
			  							'<div style="min-width:230px; margin-left:20px; margin-right:20px; max-height:15px;">' +
			  							'</p>' +
			  							'<input id="play" type="button" value="Play" class="pure-button pure-button-primary" onclick="playAudio();"/>' +
			  							'&nbsp' +
			  							'<input id="pause" type="button" value="Pause" class="pure-button pure-button-primary" onclick="pauseAudio();" />' +
			  							'&nbsp' +
			  							'<input id="stop" type="button" value="Stop" class="pure-button pure-button-primary" onclick="stopAudio();" />' +
										'</div>');

	pins.infoWindow[pinNum].open(map, pins.pin[pinNum]);

}

// A function to select all the markers on the map
function selectAll() {
	// Iterates over the dictionary of pins and calls the select marker function on each marker
	for(var i = 0; i < numberOfPins; i++) {
		if((pins.startTime[i] > selectedStartTime && pins.startTime[i] < selectedEndTime) || 
				(pins.endTime[i] < selectedEndTime && pins.endTime[i] > selectedStartTime) ||
				(pins.startTime[i] < selectedStartTime && pins.endTime[i] > selectedEndTime)) {
			
			selectMarker(i);
		}
	}
}

// A function that triggers a mock click on a single marker
function selectMarker(pinNum) {
	if(!pins.selected[pinNum]) {
    	google.maps.event.trigger(pins.pin[pinNum], 'click', {});
    }
}

// A function to select all the markers on the map
function deSelectAll() {
	// Iterates over the dictionary of pins and calls the select marker function on each marker
	for(var i = 0; i < numberOfPins; i++) {
		deSelectMarker(i);
	}
}

// A function that triggers a mock click on a single marker
function deSelectMarker(pinNum) {
	if(pins.selected[pinNum]) {
    	google.maps.event.trigger(pins.pin[pinNum], 'click', {});
    }
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

function playSelected() {
	pinIDArray = [];
	for(var i = 0; i<numberOfPins; i++) {
		if(pins.selected[i]) {
			pinIDArray.push(pins.fileID[i]);
		}
	}
	var syncedFiles = syncFileArray(pinIDArray);
	syncedFiles.togglePlay();
}

function stopSelected() {
	syncedFiles.togglePlay();
}

function setSelectedStartTime(dateObject) {
	selectedStartTime = dateObject.getTime();
}

function setSelectedEndTime(dateObject) {
	selectedEndTime = dateObject.getTime();
}

function zoomAndSelect() {

	alert("start");
	name = document.getElementById("searchbar").value;

	alert(name);

	if(name.indexOf(",") == -1) {
		return;
	}
  	var fn = name.split(", ")[0];
  	var pk = name.split(", ")[1];

  	alert("here");

  	$.getJSON(
  		"/webapp/getrecbyid:" + pk,

  		function(data) {

  			alert("ami I here?");
  			alert(lat);
  			alert(lng);

  			lat = parseFloat(data[0].fields.lat);
			lng = parseFloat(data[0].fields.lon);

			map.setCenter(new google.maps.LatLng(lat, lng));
			map.setZoom(18);

  		}
  	);
}