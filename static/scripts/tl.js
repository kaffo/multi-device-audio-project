var selected = [];

function selectRec(){
	
	var rows = document.getElementsByName('rec');
	selected = [];
	
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
	
	//alert(selected.length);
	syncSide(selected);
	
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
		Rdata += "<div class='comp'><audio controls src='../../static/data/" + c_file + "'>Your user agent does not support the HTML5 Audio element.</audio><br><br>";
		Rdata += "<form target='_blank' action='../../static/data/" + c_file + "'><input type='submit' value='Download' class='blue button'></form></div>"
		//Rdata += "<div style='float:left;'><button class='blue button' onclick='this.firstChild.play()'><audio src='../../static/data/" + c_file + "'></audio>Play</button>";
		Rdata += "<p><b>ID:</b> " + c_id + "<br><b>Recording:</b> " + c_name + "<br><br><b>Description:</b><br>"  + c_desc + "</p>";
		
		Rdata += "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.</div>";
	}
	
	document.getElementById("uRecs").innerHTML=Rdata;
	
}

function syncSide(selected){
	syncArray(selected);
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
		width:      (window.innerWidth),
		height:     (window.innerHeight - 160),
		source:     '/static/scripts/data.json',
		embed_id:   'my-timeline',
		start_at_slide:     '1',                         
		start_zoom_adjust:  '0',                          
		hash_bookmark:      true,
		gmap_key:			'AIzaSyAcCsb4_1FhEOP4bYPwm10FV_bGhjHBBH0',
		font:               'Arvo-PTSans',            
		debug:              true,                           
		lang:               'en',
		start_at_end:       'true'
	
	});

	
	$.getJSON(
		"/webapp/getUserRecs:" + getUser(), // + user,
		
		function(data){
			recs = data;
			text(recs);
			
	});
		
	window.onresize = autoResizeDiv;
	autoResizeDiv();
	
});
