// MDRS - JavaScript for Map
// Author - Gordon Adam

// Global Variables 
var defaultLatLng = new google.maps.LatLng(55.873657, -4.292474);
var homeMarker;
var map;

// Creates the a dictionary of arrays of pins that will contain all the pins on visible on the map
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
    image: [],
    selected: []
};

// Creates a dictionary of selected pins that may not necessarily be visible on the map
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
    image: [],
    selected: []
};


var numberOfPins;

// The image for your current location
var homeDotImage = {
	url: '/static/images/home.png',
	anchor: new google.maps.Point(14,14)
};

// The image for a typical marker
var pinImage = {
	url: '/static/images/marker.png'
};

// The selected marker image
var selectedPinImage = {
	url: '/static/images/marker_selected.png'
};

// The range for selecting markers by date and time
var selectedRange = {
	startDate: '',
	startTime: '',
	endDate: '',
	endTime: ''
};
 	

// Funuction to start map
function initialize() {

	// Sets the options on the map
    var mapOptions = {
		disableDefaultUI: true,
		zoom: 6,
		center: defaultLatLng,
		mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    
	/*
	Uses HTML5 geolocation to track your location
	If geolocation succeeds then a marker is set at your position
	*/
    if(navigator.geolocation) {
    	navigator.geolocation.getCurrentPosition(
    		function(position) {

    			// Creates a new lat and lon and your position
      			var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      			// Sets the centre of the map and zooms in on that position
      			map.setCenter(pos);
      			map.setZoom(17);

      			// Creates an image for the home marker anchoring the centre of the image
      			var image = {
      				url: '/static/images/home.png',
      				anchor: new google.maps.Point(14,14)
      			}

      			// Plots the marker on the map
      			var homeMarker = new google.maps.Marker({
					position: pos,
					icon: homeDotImage, // Loads the custom marker for each recording
					map: map
				});
  			}
  		);
	}
/*
		
*/
    // Calls the div on the webpage and binds the map to that div
    map = new google.maps.Map(document.getElementById("map-content"), mapOptions);

    // Creates a listener so that if the bounds are changed the markers are refreshed
    google.maps.event.addListener(map, 'idle', function() {
		drawMarkers()
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
    
    // Query the database for all recordings within the specified bounds
    $.getJSON(
		"/webapp/getdata:" + swLat + ":" + swLng + ":" + neLat + ":" + neLng,
	
		function(data) {

			// Iterates through each of the pins in the previous frame to check for any changes in selected status
  			for(var i = 0; i < pins.fileID.length; i++) {

  				// Checks if a pin was selected in the previous frame if so it adds it to the selectedpins array
  				if((pins.selected[i] == true) && (selectedPins.indexOf(pins.fileID[i]) == -1)) {
  					selectedPins.fileID.push(pins.fileID[i]);
					selectedPins.latLng.push(pins.latLng[i]);
					selectedPins.fileName.push(pins.fileName[i]);
					selectedPins.description.push(pins.description[i]);
					selectedPins.startTime.push(pins.startTime[i]);
					selectedPins.endTime.push(pins.endTime[i]);
					selectedPins.filePath.push(pins.filePath[i]);
					selectedPins.route.push(pins.route[i]);
					selectedPins.image.push(pins.image[i]);
					selectedPins.selected.push(pins.selected[i]);
  				}

  				// Checks if a pin was de-selected in the previous frame if so it deletes it from the selected pins array
  				if((pins.selected[i] == false) && (selectedPins.indexOf(pins.fileID[i]) != -1)) {
					var popIndex = selectedPins.fileID.indexOf(pins.fileID[i]);
					selectedPins.fileID.splice(popIndex, 1);
					selectedPins.latLng.splice(popIndex, 1);
					selectedPins.fileName.splice(popIndex, 1);
					selectedPins.description.splice(popIndex, 1);
					selectedPins.startTime.splice(popIndex, 1);
					selectedPins.endTime.splice(popIndex, 1);
					selectedPins.filePath.splice(popIndex, 1);
					selectedPins.route.splice(popIndex, 1);
					selectedPins.image.splice(popIndex, 1);
					selectedPins.selected.splice(popIndex, 1);
				}
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

    			// If the data taken from the database has already been selected then it is loaded into the array of pins, instead of creating a new one
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
					pins.image[i] = selectedPins.image[index];
					pins.selected[i] = selectedPins.selected[index];

    			} else {

    				lat = parseFloat(recordings[i].fields.lat);
					lng = parseFloat(recordings[i].fields.lon);

					pins.fileID[i] = recordings[i].pk; // The unique id of the recording
					pins.latLng[i] = new google.maps.LatLng(lat,lng); // The location of the recording
					pins.fileName[i] = recordings[i].fields.file_name; // The name of the recording
					pins.description[i] = recordings[i].fields.description; // The description of the recording
					pins.startTime[i] = (new Date(recordings[i].fields.start_time)).getTime(); // The start date and time of the recording
					pins.endTime[i] = (new Date(recordings[i].fields.end_time)).getTime(); // The end date and time of the recording
					pins.filePath[i] = "../" + recordings[i].fields.rec_file; // The file path on the server to the audio recording
					pins.route[i] = null;
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
    			addPinListenerOnClick(i, pins.fileID[i], pins.fileName[i], pins.description[i], pins.latLng[i], pins.filePath[i]);
    		}
    	}
	);

}


// Draws the polyline route on the map
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

// Removes the route from the map
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

// The image info window was deprecated in favour of a slideviewer
/*
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
*/

// A function to attach a listener for a mouse click on a marker
function addPinListenerOnClick(pinNum, fileID, fileName, description, latLng, filePath) {

    // creates a listener for a click action on the marker
    google.maps.event.addListener(pins.pin[pinNum], 'click', (function(pinNum, fileID, fileName, description, filePath, latLng) {
		return function() {

			// If the pin is not selected already then this body is executed
			if(!pins.selected[pinNum]) {
				pins.pin[pinNum].setIcon(selectedPinImage); // sets the icon to the selected pin image
				pins.image[pinNum] = selectedPinImage;
				pins.selected[pinNum] = true; // sets it's status as selected
				drawRecordingBox(pinNum, fileID, fileName, description, filePath); // If the marker is clicked an info window is opened
	    		addRouteToMarker(pinNum, fileID, latLng); // If the marker is clicked the route is queried and drawn
	    	}
	    	else {
				pins.pin[pinNum].setIcon(pinImage); // Sets the icon as that of one that's not selected
				pins.image[pinNum] = pinImage;
				pins.selected[pinNum] = false; // sets it's status as not selected
				deleteRouteFromMap(pinNum); // If the marker is clicked an info window is opened
				drawRecordingBox(pinNum, fileID, fileName, description, filePath); // If the marker is clicked an info window is opened
	    	}
		}
    })(pinNum, fileID, fileName, description, filePath, latLng));
}


// A function that opens up a recording box with all the details provided
function drawRecordingBox(pinNum, fileID, fileName, description, filePath) {

	// Loads a new sound using buzz
    mySound = new buzz.sound("../" + filePath + "/" + fileName + ".ogg");

    // Sets the title and description in the box
	document.getElementById("title").innerHTML=fileName;
	document.getElementById("description-container").innerHTML=description;
	
	// Checks if the recording box is closed, if it is then it's opened
	if(recording_box == false) {
		$("#recording_box").toggle({easing: "easeOutBack"});
		recording_box = true;
	}

	// Creates the button to view pictures sending the fileid to the viewimages function
	document.getElementById("view_pictures").innerHTML="<input id=\"view_pictures\" type=\"button\" value=\"View Pictures\" class=\"pure-button pure-button-primary\" style=\"font-size:13px;\" onclick=\"viewImages(" + fileID + ");\" />";
	//view on timeline button added
	document.getElementById("view_timeline").innerHTML="<input id=\"view_timeline\" type=\"button\" value=\"Timeline\" class=\"pure-button pure-button-primary\" style=\"font-size:13px;\" onclick=\"window.location='#" + (pinNum + 1) + "'\" />";
}


// A function to select all the markers on the map
function selectAll() {

	// Retrieves the values from the text boxes
	selectedRange.startTime = document.getElementById("start_time").value;
	selectedRange.endTime = document.getElementById("end_time").value;
	selectedRange.startDate = document.getElementById("start_date").value;
	selectedRange.endDate = document.getElementById("end_date").value;

	/* 
	If a start date is not entered it will default to the epoch start date.
	If an end date is not entered it will default to the year 3000.
	If a start time is not entered it will default to midnight
	and the end time will default to midnight
	*/
	if(selectedRange.startDate == "") {
		selectedRange.startDate = "01/01/1970"
	}
	if(selectedRange.endDate == "") {
		selectedRange.endDate = "01/01/3000"
	}
	if(selectedRange.startTime == "") {
		selectedRange.startTime = "00:00"
	}
	if(selectedRange.endTime == "") {
		selectedRange.endTime = "23:59"
	}

	// Turns the dates into american style
	selectedRange.startDate = (selectedRange.startDate.split("/")[1] + "/" + selectedRange.startDate.split("/")[0] + "/" + selectedRange.startDate.split("/")[2]);
	selectedRange.endDate = (selectedRange.endDate.split("/")[1] + "/" + selectedRange.endDate.split("/")[0] + "/" + selectedRange.endDate.split("/")[2]);

	// converts the date and time into milliseconds since epoch
	var selectedStartTime = (new Date(selectedRange.startDate + " " + selectedRange.startTime)).getTime();
	var selectedEndTime = (new Date(selectedRange.endDate + " " + selectedRange.endTime)).getTime();

	// Iterates over the dictionary of pins and calls the select marker function on each marker that satisfies the comparison
	for(var i = 0; i < numberOfPins; i++) {
		if((pins.startTime[i] >= selectedStartTime && pins.startTime[i] <= selectedEndTime) || 
				(pins.endTime[i] <= selectedEndTime && pins.endTime[i] > selectedStartTime) ||
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

// Plays a sing recording
function playAudio() {
    mySound.play()
	.bind( "timeupdate", function() {
	    var timer = buzz.toTimer( this.getTime() );
	    document.getElementById( "timer" ).innerHTML = timer;
	});
}

// Pauses a single recording
function pauseAudio() {
    mySound.pause();
}

// Stops a single recording
function stopAudio() {
    mySound.stop();
}

// Creates an array of the currently selected items id's and calls the function from syncSound with the array of id's to play
function playSelected() {

	pinIDArray = []; // The empty array of pins to be filled and sent to syncSound

	// Fills the array with any selected markers
	for(var i = 0; i<numberOfPins; i++) {
		if(pins.selected[i]) {
			pinIDArray.push(pins.fileID[i]);
		}
	}
	
	/*
	if(pinIDArray.length != 0){
		setSelected(pinIDArray);
		syncSide();play();
	}
	else{
		alert("No recordings have been selected.") //alert the user
	}
	
	*/
	
	/*

	// Calls the function in syncSound to create the buzz object and plays it
	var syncedFiles = syncFileArray(pinIDArray);
	syncedFiles.togglePlay();
	
	*/
}

// Stops the selected recordings that are currently playing
function stopSelected() {
	syncedFiles.togglePlay();
}

// A function that finds a marker then zooms in on it
function findAndZoom() {

	name = document.getElementById("searchbar").value; // Gets the value from the searchbar

	// Checks that the value is in the correct format
	if(name.indexOf(",") == -1) {
		return;
	}

	// Parses the data from the searchbar 
  	var fn = name.split(", ")[0];
  	var pk = name.split(", ")[1];

  	// Queries the database for any recordings with the primary key
  	$.getJSON(
  		"/webapp/getrecbyid:" + pk,

  		function(data) {
  			
  			// gets the lat and lon from the recording returned from the database
  			lat = parseFloat(data[0].fields.lat);
			lng = parseFloat(data[0].fields.lon);

			// sets the centre of the map to the returned recording and zooms in on it
			map.setCenter(new google.maps.LatLng(lat, lng));
			map.setZoom(18);

  		}
  	);
}

// Function to open up the slide viewer and load the images for a particular recording
function viewImages(fileID) {

	var images = []; // Sets the array of images that are retrieved from the database to empty

	$.getJSON("/webapp/getImagesByID:" + fileID, //Queries the database for images using the id of the recording

		function(data) {

			// If the picture box is hidden behind the map, it is brought to the foreground
	       	if($("#picture_box").css("z-index") == 0) {
        		$("#picture_box").css("z-index", 4);
        	}

        	// Creates an array of images that will be in the slideshow
	    	for(var i = 0; i < data.length; i++) {
	    		images.push("../" + data[i].fields.file_name);
	    	}

        	slideArray[slideVersion].remove(); // removes previous slides

        	// Creates the new empty div for the slideshow
        	slideArray[slideVersion + 1] = $("<div />")
        		.appendTo($("#picture_content"));

        	// From the array add each image to the slideshow
        	for(var i = 0; i < data.length; i++) {
        		$("<img />")
        			.attr("src", images[i])
        			.appendTo(slideArray[slideVersion + 1]);
        	}

        	// Initiate the new slideshow
        	slideArray[slideVersion + 1].slidesjs({
        		width: 150,
        		height: 100,
        		pagination: {
      				active: false
    			},
    			callback: {
      				loaded: function(){
        				// Hides navigation and pagination
        				$('.slidesjs-pagination, .slidesjs-navigation').hide(0); 
      				}
    			}
    		});
        	
    		slideVersion = slideVersion + 1;
		});
}
