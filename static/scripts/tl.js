$(document).ready(function() {
	createStoryJS({
		type:       'timeline',
		width:      (window.innerWidth - 150)*0.75,
		height:     (window.innerHeight - 160),
		source:     '/static/scripts/data.json',
		embed_id:   'my-timeline'
	
	});
	
	
		var Rdata="";
		
		function text(recs){
			
			var c_rec, c_id, c_name, c_desc, c_file;
			
			for(var i=0;i<recs.length;i++){
				c_rec = recs[i];
				c_id = c_rec.pk;
				c_name = c_rec.fields.file_name;
				c_desc = c_rec.fields.description;
				c_file = c_rec.fields.rec_file;
				
				Rdata += "<div style='float:left;'><button class='blue button' onclick='this.firstChild.play()'><audio src='../../static/data/" + c_file + "'></audio>Play</button><br>";
				Rdata += "<form target='_blank' action='../../static/data/" + c_file + "'><input type='submit' value='Download' class='blue button'></form></div>";
				Rdata += "<p> Recording: " + c_name + "<br> ID: " + c_id + "<br>Description:<br>" + c_desc + "</p>";

			}
			
			document.getElementById("uRecs").innerHTML=Rdata;
			
			
		}
		
			$.getJSON(
				"/webapp/getRecs", // + user,
				
				function(data){
					recs = data;
					text(recs);
					
			});
		
		
	function autoResizeDiv()
	{

		var tlwidth = (window.innerWidth - 150)*0.75 + 'px';
		var tlheight = (window.innerHeight - 160) + 'px';
		
		var Iwidth = (window.innerWidth - (window.innerWidth - 150)*0.75 - 200) + 'px';
		var Iheight = (window.innerHeight - 165) + 'px';
		
		document.getElementById('my-timeline').style.width = tlwidth;
		document.getElementById('my-timeline').style.height = tlheight;
		
		document.getElementById('info').style.width = Iwidth;
		document.getElementById('info').style.height = Iheight;
	}
	window.onresize = autoResizeDiv;
	autoResizeDiv();
	
});
