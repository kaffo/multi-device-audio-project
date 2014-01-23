var recording;


function playS(id){

	var recording;
	var fileP;
	window.alert("sometext");
	$.get(
	    "/webapp/playSound:" + id,

	    return function(rec) {

			recording = eval("(" + rec + ")");
			
			fileP = recording.fields.rec_file;
			fileP = "../" + fileP;
			window.alert(fileP);
			var soundObj = new buzz.sound(fileP);
		}
		
	   
	);

    soundObj.play();
	
}
