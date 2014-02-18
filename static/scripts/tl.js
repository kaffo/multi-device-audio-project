$(document).ready(function() {
	createStoryJS({
		type:       'timeline',
		width:      (window.innerWidth - 150)*0.75,
		height:     (window.innerHeight - 160),
		source:     '/static/scripts/data.json',
		embed_id:   'my-timeline'
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
