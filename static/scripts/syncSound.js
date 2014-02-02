var s;
var group;

var curr_rec;
var curr_start;
var curr_end;
var curr_s_obj;

var recs;
var sync = new Array();
var sync_group = new Array();

var check_rec;
var check_id;
var check_start;
var check_end;
var loaded = 0;

var s_obj;
			
function compare(a,b){
	if(a.fields.start_time<b.fields.start_time)
		return -1;
	if(a.fields.start_time>b.fields.start_time)
		return 1;
	return 0;
}

function process_data(recs){

	for(var i=0;i<recs.length;i++){
		check_rec = recs[i];
		check_id = check_rec.fields.file_ID;
		check_start = check_rec.fields.start_time;
		check_end = check_rec_fields.end_time;
		
		if((curr_start.getTime() <= check_start.getTime() && check_end.getTime()<= curr_end.getTime()) || 
			(curr_start.getTime()>=check_start.getTime() && curr_start.getTime()<=check_end.getTime()) || 
			(curr_end.getTime()>=check_start.getTime() && curr_end.getTime()<=check_end.getTime())
		)
		
		{
			//diff = (check_start.getTime() - curr_start.getTime())/1000;
			//check_rec["difference"] = diff;
			sync.push(check_rec);
		}
	}
	
}

function load_data(sync){

	var diff;
	var last = sync[sync.length-1];

	for(var j=0;j<sync.length-1;j++){
	
		s_obj = new buzz.sound(sync[i].fields.rec_file);
		diff = (last.fields.start_time.getTime() - sync[i].fields.start_time.getTime())/1000;
		if(diff>=0){
			s_obj.setTime(diff);
		}
		
		else{
			alert("error");
		}
		
		sync_group.push(s_obj);
	}
	
	loaded = 1;
	
}

function synchronise(id){

	$.get("/webapp/playSound:" + id,
	
	function(data){
		curr_rec = eval("(" + data + ")");
		curr_start = curr_rec.fields.start_time;
		curr_end= curr_rec.fields.end_time;
		curr_s_obj = new buzz.sound(curr_rec.fields.rec_file);
	});


	$.get(
		"/webapp/getRecs",
		
		function(data){
			recs = eval("("+ data +")");
			process_data(recs);
			
		});

	sync = sync.sort(compare);
	
	load_data(sync);


	var s1 = new buzz.sound( "../../static/data/second_audio.ogg");
	s = new buzz.sound( "../../static/data/" + id +".ogg"); //curr_rec.fields.rec_file
	
	s.setTime(10);
	sync_group.push(s);
	sync_group.push(s1);
	
	group = new buzz.group(sync_group);
}

function playS(id){
	if(loaded==0)
		synchronise(id);
	group.play();
}

function pauseS(){
	group.pause();
}

function stopS(){
	group.stop();
}