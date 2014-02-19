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
			
			var check_rec, check_id, check_name, check_desc;
			
			for(var i=0;i<recs.length;i++){
				check_rec = recs[i];
				check_id = check_rec.pk;
				check_name = check_rec.fields.file_name;
				check_desc = check_rec.fields.description;
				
				Rdata += "<p> <button class='blue button' onclick=''>Play</button> Recording: " + check_name + "<br> ID: " + check_id + "<br>Description:<br>" + check_desc + "</p>";

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
