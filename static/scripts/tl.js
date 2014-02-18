$(document).ready(function() {
	createStoryJS({
		type:       'timeline',
		width:      window.innerWidth - 150,
		height:     window.innerHeight - 120,
		source:     '/static/scripts/data.json',
		embed_id:   'my-timeline'
	});
});