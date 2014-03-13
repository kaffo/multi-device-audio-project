// MDRS - Search Autocomplete
// Author - Gordon Adam

// Function to complete what the user wants to search for
$(function() {

	// Start with empty array of tags
	var availableTags = [];

	// Returns all recordings from database
	$.getJSON(
		"/webapp/getRecs",

		// Pushes them all into array of tags
		function(data) {
			for(var i = 0; i < data.length; i++) {
				availableTags.push(data[i].fields.file_name + ", " + data[i].pk);
			}
		}
	)
	// Using the array of available tags initialises jquery's autocomplete on the search bar
	$( "#searchbar" ).autocomplete({
		source: availableTags
	});
});