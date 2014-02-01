$(document).ready(function() {
	createStoryJS({
		type:       'timeline',
		width:      window.innerWidth - 150,
		height:     '300',
		source:     '/static/scripts/data.json',
		embed_id:   'my-timeline'
	});
});