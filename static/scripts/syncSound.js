//pyordanov

jQuery.ajaxSetup({async:false});

var group;

var curr_rec;
var curr_start;
var curr_end;
var curr_s_obj;

var recs;
var sync = new Array();
var sync_group = new Array();

var loaded = 0;
			
function compare(a,b){
	if(a.fields.start_time<b.fields.start_time)
		return -1;
	if(a.fields.start_time>b.fields.start_time)
		return 1;
	return 0;
}

function process_data(recs){
	
	var check_rec;
	var check_id;
	var check_start;
	var check_end;
	
	for(var i=0;i<recs.length;i++){
		check_rec = recs[i];
		check_id = check_rec.pk;
		check_start = new Date(check_rec.fields.start_time);
		check_end = new Date(check_rec.fields.end_time);
		//alert(check_end.getTime());
		//alert(curr_start <= check_start );
		//alert(check_end<= curr_end);
		//alert(check_start + " " + check_end);
		if((curr_start.getTime() <= check_start.getTime() && check_end.getTime()<= curr_end.getTime()) || 
			(curr_start.getTime()>=check_start.getTime() && curr_start.getTime()<=check_end.getTime()) || 
			(curr_end.getTime()>=check_start.getTime() && curr_end.getTime()<=check_end.getTime())
		)
		
		{
			sync.push(check_rec);
		}
		//alert(sync[1].fields.rec_file + "da");
		//alert(curr_start + " " + curr_end + " " + check_start + " " + check_end );
	}
	
	//alert(sync[1].fields.rec_file + "tosync");
	
	sync = sync.sort(compare);
	alert(sync.length);
	return sync;
	
}

function load_data(sync){
	var diff;
	var last = sync[sync.length-1];
	var s_obj;
	//alert(last.fields.start_time);
	
	var l = new Date(last.fields.start_time);
	var s;

	for(var i=0;i<sync.length;i++){
		s = new Date(sync[i].fields.start_time);
		alert("../../" + sync[i].fields.rec_file);
		s_obj = new buzz.sound("../../" + sync[i].fields.rec_file);
		sync_group.push(s_obj);
		diff = (l.getTime() - s.getTime())/1000;
		//diff = 10;
		if(diff>=0){
			s_obj.setTime(diff);
			alert(l.getTime() + " " + s.getTime());
		}
		
		else{
			alert("error");
		}
		
	}
	alert(sync_group.length);
	loaded = 1;
	
}

function synchronise(id){

	$.get("/webapp/playSound:" + id,
		
		function(data){
			curr_rec = eval("(" + data + ")");
			curr_start = new Date(curr_rec[0].fields.start_time);
			curr_end= new Date(curr_rec[0].fields.end_time);
			curr_s_obj = new buzz.sound("../../" + curr_rec[0].fields.rec_file);
			//alert(curr_rec[0].fields.rec_file);
		});
		
		

	$.get(
		"/webapp/getRecs",
		
		function(data){
			recs = eval("("+ data +")");
			//alert(recs[0].fields.start_time);
			var toSync = process_data(recs);
			alert(toSync.length);
			load_data(toSync);
			//sync_group.push(curr_s_obj);
			alert("final" + sync_group.length);
	
			group = new buzz.group(sync_group);
			//group.togglePlay();
		});
	

	
	//var s1 = new buzz.sound( "../../static/data/second_audio.ogg");
	//var s = new buzz.sound( "../../static/data/" + id +".ogg"); //curr_rec.fields.rec_file
	
	//s.setTime(25.5);
	//sync_group.push(s1);
	//sync_group.push(s);
}

function playS(id){
	alert("loaded" + loaded);
	if(loaded==0)
		synchronise(id);
	group.togglePlay();
}

function stopS(){
	group.stop();
}
