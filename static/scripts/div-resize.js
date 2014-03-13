// MDRS - Div Resizing
// Author - Gordon Adam

// Function designed to resize the bounds of the map according to the size of the window
function autoResizeDiv() {

	// Gets the current size of the window
	var mheight = (window.innerHeight) +'px'; 
	var mwidth = (window.innerWidth) +'px';
	var tlwidth = (window.innerWidth - 170) + 'px';

	// Applies those sizes to the map, and timeline
	document.getElementById('map-content').style.height = mheight;
	document.getElementById('map-content').style.width = mwidth;
	document.getElementById('my-timeline').style.width = tlwidth;
}

// Sets it so that this function is called on a window resize
window.onresize = autoResizeDiv;
autoResizeDiv();