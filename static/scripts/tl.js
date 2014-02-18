$(document).ready(function() {
	createStoryJS({
		type:       'timeline',
		width:      window.innerWidth - 150,
		height:     window.innerHeight - 140,
		source:     '/static/scripts/data.json',
		embed_id:   'my-timeline'
	});
});