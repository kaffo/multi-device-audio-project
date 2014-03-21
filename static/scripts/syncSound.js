/*

	- audio synchronization functions (using Buzz!)
	- user recording ajax requests getting metadata from the database (using Django's views)
	- recording overlap checking functions
	
	Author: P. Yordanov (v3.0)

*/




var s_group = new buzz.group([]);
var USER;

//variables to store information for the current recording
var curr_rec = null; //rec object
var curr_start; //start time
var curr_end; // end time
var curr_s_obj; // the sound object to be created for buzz to be able to process the data

var recs; //recordings array from GET request
var sync = new Array(); //array of objects to be synced
var sync_group = new Array();

var loaded = 0; //indication of whether or not the script has loaded

//recording information to be displayed to the user before playback
var info = "";
var uRecs = "";

var duration;

var mapSrc = 0;

function setUser(u){
	USER = u;
}


function getUser(){
	return USER;
}

function setMapSrc(){
	mapSrc = 1;
}

//a function to sort the synchronisation array
function compare(a,b){
	if(a.fields.start_time<b.fields.start_time)
		return -1;
	if(a.fields.start_time>b.fields.start_time)
		return 1;
	return 0;
}

/*

initial data processing function filtering recordings
that are to be synchronised depending on recording times
(takes an array of recordings from the database as input parameter)

*/

function process_data(recs){
	
	//variables to store array recording objects
	
	var check_rec; // recording object
	var check_id; // id
	var check_start; //start time
	var check_end; //rec. end time
	var check_name;
	var check_file;
	
	sync = [];
	
	uRecs = ""; //uRecs -> null

	if(recs.length == 1){
		sync.push(recs[0]);
	}
	
	else{
	
		//populating the sync array with relevant recording objects
		for(var i=0;i<recs.length;i++){
			check_rec = recs[i];
			check_id = check_rec.pk;
			check_start = new Date(check_rec.fields.start_time);
			check_end = new Date(check_rec.fields.end_time);
			
			check_name = check_rec.fields.file_name;
			check_desc = check_rec.fields.description;
			check_file = check_rec.fields.rec_file;
		
			
			//start-end time comparison check (three different overlap options)
			if(
				
				(curr_start.getTime() <= check_start.getTime() && check_end.getTime()<= curr_end.getTime()) ||
				
				(curr_start.getTime()>=check_start.getTime() && curr_start.getTime()<=check_end.getTime()) ||
				
				(curr_end.getTime()>=check_start.getTime() && curr_end.getTime()<=check_end.getTime())
				
			)
			
			{
				//if the current recording overlaps with any database objects in the Recording relation
				//add them to the SYNC array for further processing
				sync.push(check_rec);
			}
			
		}
		
		//sort the array according to start times
		sync = sync.sort(compare);
		
		if(sync.length == 1){
			sync = [];
		}
	
	}
	
	return sync;
	
}

/*

using the array with relevant recording objects create buzz! sound objects,
set their times accordingly, and populate the group array sync_group

*/

function load_data(sync){
	
	//store the time difference between start times
	var diff;
	
	//store the last recording from the sync array as it should match the current one after sorting
	var last = sync[sync.length-1];
	
	//buzz sound object
	var s_obj;
	
	sync_group = [];
	
	//last object start/end time
	var ls,le;
	ls = new Date(last.fields.start_time);
	le = new Date(last.fields.end_time);
	duration = (le.getTime() - ls.getTime())/1000;
	//checked recording start time will be stored here
	var s;

	info = "";//info -> null
	
	for(var i=0;i<sync.length;i++){
		s = new Date(sync[i].fields.start_time);
		s_obj = new buzz.sound("../../" + sync[i].fields.rec_file + "/" + sync[i].fields.file_name + ".ogg");
		sync_group.push(s_obj);
		
		//use start time difference to calibrate synchronisation
		diff = (ls.getTime() - s.getTime())/1000;
		
		//files to be synced information to be presented before playback
		info += sync[i].fields.rec_file.replace('static/data/', '') + "&nbsp;&nbsp; " + diff + "s <br>";
		
		if(diff>=0){
			s_obj.setTime(diff);
		}
		
		else{
			alert("error");
		}
		
	}
	
	//the script has now loaded successfully
	loaded = 1;
	//display recording information before playback
	//alert("Rec.: \t Sync at: \n" + info);

}

function synchronise(id, user){

	//check if html5 audio tag is supported
	if (!buzz.isSupported()) {
    alert("You need to update your browser to view this content");
	}
	
	//check if .OGG audio format is supported
	if (!buzz.isOGGSupported()) {
    alert("Your browser does not support .ogg audio format.");
	}

	

	//get request for accessing current sound object attributes
	$.getJSON("/webapp/playSound:" + id,
		
		function(data){
			curr_rec = data;
			curr_start = new Date(curr_rec[0].fields.start_time);
			curr_end= new Date(curr_rec[0].fields.end_time);
			curr_s_obj = new buzz.sound("../../static/data/" + curr_rec[0].fields.rec_file);
		});
		
	var request = "";
	
	if(USER == null){
		request = "/webapp/getRecs";
	}
	else{
		request = "/webapp/getUserRecs:" + USER;
	}

	//get request for populating the recs array with database recording objects and process the data
	$.getJSON(
		request, // + user,
		
		function(data){
			recs = data;
			var toSync = new Array();
			toSync = process_data(recs);
			load_data(toSync);
		
			s_group = new buzz.group(sync_group);
			s_group.load();
		});
	

}







function syncArray(IDs){

	//check if html5 audio tag is supported
	if (!buzz.isSupported()) {
    alert("You need to update your browser to view this content");
	}
	
	//check if .OGG audio format is supported
	if (!buzz.isOGGSupported()) {
    alert("Your browser does not support .ogg audio format.");
	}
	
	
	/*
	
	a request string to initialize a GET request to the database
	depending on whether the user is logged in or not 
	
	*/
	
	var request = ""; 
	
	if(USER == null){ //check
		request = "/webapp/getRecs";
	}
	else{
		request = "/webapp/getUserRecs:" + USER;
	}

	
	$.getJSON(
		request, // + user,
		
		function(data){
		
			var recs = data;
			var r = "";
			var arrInfo = new Array();
			var toSync = new Array();

			
			if (IDs != undefined){
				for(var i=0;i<IDs.length;i++){
					for(var j=0;j<recs.length;j++){
						r = recs[j];
						if(IDs[i] == r.pk){
							arrInfo.push(r);
						}
					}
				}
				
				arrInfo = arrInfo.sort(compare);
				curr_rec = arrInfo[arrInfo.length-1];
				curr_start = new Date(curr_rec.fields.start_time);
				curr_end= new Date(curr_rec.fields.end_time);
				curr_s_obj = new buzz.sound("../../" + curr_rec.fields.rec_file + "/" + curr_rec.fields.file_name + ".ogg");
				

				toSync = process_data(arrInfo);
				
				
				//if there are no overlapping recordings in the array selection, notify the user
				if (toSync.length == 0){
					alert("The selected recordings do not overlap. /Note that recordings are synchronised relative to the one with earliest start time./");
					deSelectAll();
					s_group = null;
				}

				else{
				
					load_data(toSync);
					
					s_group = new buzz.group(sync_group); // initialize the s_group using the sync_group array
					s_group.load(); //load the grouped recording objects

					if(mapSrc == 1){
						mapSrc = 0;
						s_group.play();
					}
				
				}
				
			}
			
		});

	

}


//synchronise files in an array of id-s
function syncFileArray(arr){
	if(loaded==0){
		syncArray(arr);
	}
}

function play(){

	if(s_group!=null){
		s_group.togglePlay();
	}
	
	else{
		alert("No recordings are selected.");
	}
}

function stop(){
	s_group.stop();
	s_group = null;
	deSelectAll();
	loaded = 0;
}





//load function
function load(id){
	alert("Loaded: " + loaded);
	if(loaded==0){
		synchronise(id);
	}
}


//toggle play function 
// (plays the grouped sound objects after syncing them)

var cid=-1;


function playS(id){

	
	//alert("Loaded: " + loaded);
	if(loaded==0){
		synchronise(id);
	}
	
	document.getElementById("tl").innerHTML=info;
	//document.getElementById("uRecs").innerHTML=uRecs;
	
	s_group.togglePlay();
	
	//s_group.play();
	
	if(id!=cid && cid!=-1){
		s_group.stop();
		sync = new Array();
		sync_group = new Array();
		synchronise(id);
	}
	
	//check the current file id
	cid = id;
}



function stopS(){
	s_group.stop();
	sync = new Array();
	sync_group = new Array();
	synchronise(id);
}
