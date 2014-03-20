/*

	- Timeline initialization
	- Auto-resize functions for timeline and user page side containers
	- Initialization of recording list and synchronization buttons on user page
	
	Author: pyordanov (v3)
	
*/

var selected = []; //an array of file ids to be synchronised
var all = false //check the current status of the select all checkbox

var choice = 1; //showcase user recordings by default

//used to set the array of selected files
// from external javascript files
function setSelected(s){
	selected = s;	
}

//clear all selections when playback is stopped
function deSelectAll(){

	var rows = getRecs();

	for(var i=0;i<rows.length;i++){
		rows[i].checked = false;
	}
	
	all = false;
	
}

function getRecs(){

	return document.getElementsByName('rec'); //get the div with id rec
	
}


//function to add the selected file ids to the array
function selectRec(){
	
	var rows = getRecs();
	selected = []; // empty the array
	
	//if the select all checkbox is marked, add all recordings to the array
	if(rows[0].checked && !all){
		for (var i = 1, l = rows.length; i < l; i++) {
			selected.push(rows[i].id);
			rows[i].checked = true;
		}
		
		all = true;
		//alert(selected.length);
	}
	
	//if the select all checkbox is not marked, remove all recordings from the array
	else if(!rows[0].checked && all){
	
		selected = [];
		
		for (var i = 1, l = rows.length; i < l; i++) {
			rows[i].checked = false;
		}
		
		all = false;

		alert("No recordings are selected.");
	}
	
	//else check the selected check boxes and fill the array
	else{
		for (var i = 1, l = rows.length; i < l; i++) {
			if (rows[i].checked) {
				selected.push(rows[i].id);
			}
		}

	}
	
	//recording synchronization depending on user selection
	syncSide(selected);
	
}


function display(){

	//add the radio button objects to an array
	var rb = document.getElementsByName('recordings');
	
	if(rb){
	
		//request string to be constructed and used when making the side recordings list
		var request = "";

		//display user recordings
		if(rb[0].checked && choice == 1){
			
			request = "/webapp/getUserRecs:" + getUser();
			
			choice = 0;
			
		}
		
		//dislay all database recordings
		else if(rb[1].checked && choice == 0){
		
			request = "/webapp/getRecs:";
			
			choice = 1;
		
		}
		
		//generate recording list based on request variable
		$.getJSON(
			request,
			
			function(data){
				var recs = data;
				text(recs);
				
		});	
	
	}

	
}

//a function to populate the right sidebar with user's recordings
function text(recs){

	var Rdata="";
	var IDs = [];
	
	var c_rec, c_id, c_name, c_desc, c_file;
	
	if(recs.length>0){
	
		var imagePath = "";
	
		for(var i=0;i<recs.length;i++){
			c_rec = recs[i];
			c_id = c_rec.pk;
			c_name = c_rec.fields.file_name;
			c_desc = c_rec.fields.description;
			c_file = c_rec.fields.rec_file;
			
			IDs.push([c_id, c_file]);

			//recording id checkbox
			Rdata += "<div class='Uinfo'><input type='checkbox' name='rec' id='" + c_id + "' onclick='selectRec();'/>";
			//single recording playback
			Rdata += "<div class='comp'><audio controls src='../../" + c_file + "/" + c_name + ".ogg" + "'>Your user agent does not support the HTML5 Audio element.</audio><br><br>";
			//download button
			Rdata += "<form target='_blank' action='../../" + c_file + "/" + c_name + ".ogg" + "'><input type='submit' value='Download' class='blue button'></form></div>";
			//Rdata += "<div style='float:left;'><button class='blue button' onclick='this.firstChild.play()'><audio src='../../static/data/" + c_file + "'></audio>Play</button>";
			//recording metadata - id, name, description
			Rdata += "<p><b>ID:</b> " + c_id + "<br><b>Recording:</b> " + c_name + "<br>";
			Rdata += "<a href='#" + (i+1) + "' title='View on timeline'>View on timeline</a><br><b>Description:</b><br>"  + c_desc + "</p>";
			
			
			Rdata += "<div id='" + c_id +"img'></div>";
			
			Rdata += "</div>";
		}
		
	}
	
	else{
	
		Rdata += "<div class='Uinfo'><b>You currently don't have any uploaded recordings. Please switch to all recordings in order to browse through other people's uploads.</b></div>";
	}
	
	//populate the div with id uRecs with the relevant html code
	document.getElementById("uRecs").innerHTML=Rdata;
	
	//load images as secondary elements;
	for(var k=0;k<IDs.length;k++){
		getImages(IDs[k][0], IDs[k][1]);
	}
	
}


function getImages(c_id, c_file){

	var Rdata = "";
	var imagePath = "";
	
	$.getJSON("/webapp/getImagesByID:" + c_id,

		function(data) {

			for(var i = 0; i < data.length; i++) {
			
				imagePath = "../../" + data[i].fields.file_name;
				
				Rdata += "<a class='enlarge' href='../" + imagePath + "' target='_blank'><img class='userImage' src='../" + imagePath + "' alt='image'><span align='center'><img width='200' height='200' src='../" + imagePath + "' /></span></a>";
			
			}
			
			document.getElementById(c_id + "img").innerHTML=Rdata;
			
	});
}


function syncSide(selected){
	syncArray(selected);
}

//auto resize code for the timeline and right sidebar
function autoResizeDiv()
{

	var tlwidth = (window.innerWidth - 400)*0.75 + 'px';
	var tlheight = (window.innerHeight - 160) + 'px';
	
	var Iwidth = (window.innerWidth - (window.innerWidth - 400)*0.75 - 200) + 'px';
	var Iheight = (window.innerHeight - 165) + 'px';
	
	document.getElementById('my-timeline').style.width = tlwidth;
	document.getElementById('my-timeline').style.height = tlheight;
	
	document.getElementById('info').style.width = Iwidth;
	document.getElementById('info').style.height = Iheight;
}

//timeline initialization function
$(document).ready(function() {
	createStoryJS({
		
		// specify the component type and make it recognizable by the timeline script
		type:       'timeline',
		
		//timeline width 
		width:      (window.innerWidth),
		
		//timeline height configuration
		height:     (window.innerHeight - 160),
		
		//timeline data source, a dynamically generated json file containing recording metadata
		source:     '/static/scripts/data.json',
		
		//my-timeline - embed id which can be changed
		embed_id:   'my-timeline',
		
		//zoom adjust to make it more convenient to distinguish difference in recording times
		start_zoom_adjust:  '0',
		
		//enable hash linking so that recording objects could be shared and accessed from different pages on the website
		hash_bookmark:      true,
		
		//add Google Maps API key to enable geo - tagging
		gmap_key:			'AIzaSyAcCsb4_1FhEOP4bYPwm10FV_bGhjHBBH0',
		
		//specify text font
		font:               'Arvo-PTSans',
		
		//show errors in the console log to enable easy debugging
		debug:              true,                           
		
		//English
		lang:               'en',
		
		//always initialize the timeline at the latest recording object
		start_at_end:       'true'
	
	});

	
	var path = window.location.pathname;

	if (path.length != 0 && path != "/webapp/" ){
		display();
	}
	
	
		
	window.onresize = autoResizeDiv;
	autoResizeDiv();
	
});
