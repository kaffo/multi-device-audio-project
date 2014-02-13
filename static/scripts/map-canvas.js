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
	disableDefaultUI: true,
	center: myLatLng,
	zoom: 3,
	mapTypeId: google.maps.MapTypeId.TERRAIN
    };
    // Calls the div on the webpage and binds the map to that div
    map = new google.maps.Map(document.getElementById("map-content"), mapOptions);
    google.maps.event.addListener(map, 'bounds_changed', function() {
	drawMarkers(false);
    });
}


// Loads the Map
google.maps.event.addDomListener(window, 'load', initialize);




// Test function to test the possibility of retrieving the bounds of the map
function drawMarkers(selected) {

    var lngLatData;
    
    // adds a listener to the map that is activated when the bounds change
    
    
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
    
    var pin;
    var image_pin;
    
    // json data variables
    
    var recordings = eval("(" + data + ")");
    var jsonArraySize = recordings.length;
    var lat;
    var lng;
    var lat_lng_route = new Array();
    
    // individual file attributes
    var fileName;
    var description;
    var lngLat;
    var filePath;
    
    // iterator over each file
    for (var i=0; i<jsonArraySize; i++) {
	
	// sets the attributes of each file 
	lat = parseFloat(recordings[i].fields.lat);
	lng = parseFloat(recordings[i].fields.lon);
	fileName = recordings[i].fields.file_name;
	description = recordings[i].fields.description;
	lngLat = new google.maps.LatLng(lat,lng);
	filePath = recordings[i].fields.rec_file;
	filePath = "../" + filePath;
	
	
	// places a pin on the map at the lat and lng specified
	pin = new google.maps.Marker({
	    position: lngLat,
	    icon: '/static/images/marker.png',
	    map: map
	});
	if(selected) {
	    drawInfoWindow(pin, fileName, description, lngLat, filePath);
	}
	else{
	    addPinListener(pin, fileName, description, lngLat, filePath);
}
    }
}
);
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

function drawRoute(lat_lng_route) {

    var route = new google.maps.Polyline({
	path: lat_lng_route,
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

function addRoute(fileName, lat_lng_route) {
    $.get(
	"/webapp/getroute:" + fileName,
	
	function(data) {
	    
	    
	    var locations = eval("(" + data + ")");
	    var locArraySize = locations.length;
	    
	    for(var i = 0; i<locArraySize; i++) {
		lat_lng_route[i+1] = new google.maps.LatLng(parseFloat(locations[i].fields.lat), parseFloat(locations[i].fields.lon));
		var image_file = locations[i].fields.image;
		
		if((locations[i].fields.image) != "") {
		    
		    image_pin = new google.maps.Marker({
			position: lat_lng_route[i+1],
			map: map
		    });
		    alert(image_file);
		    image_pin = addImageWindow(image_pin, image_file);		    
		}
		
	    }
	    var route = drawRoute(lat_lng_route);
	}		     
    );
}

function addImageWindow(image_pin, image_file) {
    
    var imageInfoWindow = new google.maps.InfoWindow();

    
    
    google.maps.event.addListener(image_pin, 'click', (function(image_pin, image_file) {
	return function() {

	    alert(image_file + "strength");
	    
	    imageInfoWindow.setContent('<div>' +
				  '<img src=' + '"/static/data/' + image_file + '" alt="Failed to load"></img>' +
				  '</div>');
	    imageInfoWindow.open(map, image_pin);
	    
	}
    })(image_pin, image_file));
    return image_pin;
}

function addPinListener(pin, fileName, description, lngLat, filePath) {
    var infoWindow = new google.maps.InfoWindow();
    // creates a listener for a click action on that pin
    google.maps.event.addListener(pin, 'click', (function(pin, fileName, description, infoWindow, filePath, lngLat) {
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
	    
	    var lat_lng_route = new Array();
	    lat_lng_route[0] = lngLat;
	    addRoute(fileName, lat_lng_route);
	    
	}
    })(pin, fileName, description, infoWindow, filePath, lngLat));
}

function selectAll() {
    drawMarkers(true);
}

function drawInfoWindow(pin, fileName, description, lngLat, filePath) {
    var infoWindow = new google.maps.InfoWindow();
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
