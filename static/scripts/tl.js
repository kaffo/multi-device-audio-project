function selectRec(){
	
	var rows = document.getElementsByName('rec');
	var selected = [];
	
	if(rows[0].checked){
		for (var i = 1, l = rows.length; i < l; i++) {
			selected.push(rows[i].id);
			rows[i].checked = true;
		}
	}
	
	else{
		for (var i = 1, l = rows.length; i < l; i++) {
			if (rows[i].checked) {
				selected.push(rows[i].id);
			}
		}
	}
	
	alert(selected.length);
	
}

function text(recs){

	var Rdata="";
	
	var c_rec, c_id, c_name, c_desc, c_file;
	
	for(var i=0;i<recs.length;i++){
		c_rec = recs[i];
		c_id = c_rec.pk;
		c_name = c_rec.fields.file_name;
		c_desc = c_rec.fields.description;
		c_file = c_rec.fields.rec_file;
		
		Rdata += "<div class='Uinfo'><input type='checkbox' name='rec' id='" + c_id + "' onclick='selectRec();'/>"
		Rdata += "<div style='float:left;'><button class='blue button' onclick='this.firstChild.play()'><audio src='../../static/data/" + c_file + "'></audio>Play</button>";
		Rdata += "<form target='_blank' action='../../static/data/" + c_file + "'><input type='submit' value='Download' class='blue button'></form></div>";
		Rdata += "<p><b>ID:</b> " + c_id + "<br><b>Recording:</b> " + c_name + "<br><br><b>Description:</b><br>"  + c_desc + "</p>";
		
		Rdata += "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.</div>";

	}
	
	document.getElementById("uRecs").innerHTML=Rdata;
	
}

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


$(document).ready(function() {
	createStoryJS({
		type:       'timeline',
		width:      (window.innerWidth - 400)*0.75,
		height:     (window.innerHeight - 160),
		source:     '/static/scripts/data.json',
		embed_id:   'my-timeline'
	
	});

	
	$.getJSON(
		"/webapp/getRecs", // + user,
		
		function(data){
			recs = data;
			text(recs);
			
	});
		
	window.onresize = autoResizeDiv;
	autoResizeDiv();
	
});
