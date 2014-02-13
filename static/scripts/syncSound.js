//pyordanov v3.0

//jQuery.ajaxSetup({async:false});

var group;

var curr_rec;
var curr_start;
var curr_end;
var curr_s_obj;

var recs;
var sync = new Array();
var sync_group = new Array();

var loaded = 0;
//recording information to be displayed to the user before playback
var info = "Rec.: \t Sync at: \n";
//var duration=2;

//a function to sort the synchronisation array
function compare(a,b){
	if(a.fields.start_time<b.fields.start_time)
		return -1;
	if(a.fields.start_time>b.fields.start_time)
		return 1;
	return 0;
}

/*initial data processing function filtering recordings
that are to be synchronised depending on recording times
(takes an array of recordings from the database as input parameter)
*/
function process_data(recs){
	
	var check_rec;
	var check_id;
	var check_start;
	var check_end;
	
	//populating the sync array with relevant recording objects
	for(var i=0;i<recs.length;i++){
		check_rec = recs[i];
		check_id = check_rec.pk;
		check_start = new Date(check_rec.fields.start_time);
		check_end = new Date(check_rec.fields.end_time);
		
		//start-end time comparison check
		if((curr_start.getTime() <= check_start.getTime() && check_end.getTime()<= curr_end.getTime()) || 
			(curr_start.getTime()>=check_start.getTime() && curr_start.getTime()<=check_end.getTime()) || 
			(curr_end.getTime()>=check_start.getTime() && curr_end.getTime()<=check_end.getTime())
		)
		
		{
			sync.push(check_rec);
		}

	}
	
	sync = sync.sort(compare);
	return sync;
	
}

/*using the array with relevant recording objects create buzz! sound objects,
set their times accordingly, and populate the group array sync_group
*/
function load_data(sync){
	var diff;
	var last = sync[sync.length-1];
	var s_obj;
	
	var l = new Date(last.fields.start_time);
	var s;

	for(var i=0;i<sync.length;i++){
		s = new Date(sync[i].fields.start_time);
		s_obj = new buzz.sound("../../" + sync[i].fields.rec_file);
		sync_group.push(s_obj);
		
		//use start time difference to calibrate synchronisation
		diff = (l.getTime() - s.getTime())/1000;
		
		info += sync[i].fields.rec_file.replace('static/data/', '') + "\t " + diff + "s \n";
		
		if(diff>=0){
			s_obj.setTime(diff);
		}
		
		else{
			alert("error");
		}
		
	}
	
	loaded = 1;
	//display recording information before playback
	alert(info);
}

function synchronise(id){

	//check if html5 audio tag is supported
	if (!buzz.isSupported()) {
    alert("You need to update your browser to view this content");
	}
	
	//check if .OGG audio format is supported
	if (!buzz.isOGGSupported()) {
    alert("Your browser does not support .ogg audio format.");
	}

	//get request for accessing current sound object attributes
	$.get("/webapp/playSound:" + id,
		
		function(data){
			curr_rec = eval("(" + data + ")");
			curr_start = new Date(curr_rec[0].fields.start_time);
			curr_end= new Date(curr_rec[0].fields.end_time);
			curr_s_obj = new buzz.sound("../../" + curr_rec[0].fields.rec_file);
		});
		
		
	//get request for populating the recs array with database recording objects and process the data
	$.get(
		"/webapp/getRecs",
		
		function(data){
			recs = eval("("+ data +")");
			var toSync = process_data(recs);
			
			load_data(toSync);
	
			group = new buzz.group(sync_group);
		});
	

}

function load(id){
	alert("Loaded: " + loaded);
	if(loaded==0){
		synchronise(id);
	}
}

function playS(id){

	//alert("Loaded: " + loaded);
	if(loaded==0){
		synchronise(id);
	}
	
	group.togglePlay();
	
}

/*
group.bind("timeupdate", function(e){
	if(group.getTime()>duration){
		group.stop();
	}
	alert("go");
	console.log(group.getTime());
});

*/
