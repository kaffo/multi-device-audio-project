// MDRS - JQuery for controlling the behaviour of the popup boxes 
// Included is the behaviour of the opening and closing of the popup boxes and also the slideviewer
// Author - Gordon Adam

// Hides the boxes to start with
$("#control_box").toggle();
$("#recording_box").toggle();

// Makes the boxes able to be dragged around the screen
$( "#control_box" ).draggable();
$( "#recording_box" ).draggable();
$( "#picture_box" ).draggable();

// Variables so indicate whether they are hidden or not
recording_box = false;
control_box = false;
timeline_visible = true;

// Function to initialize datepicker on the input box
$(function() {
  $( "#start_date" ).datepicker({
    "dateFormat": "dd/mm/yy"
  });
});

// Function to initialize datepicker on the input box
$(function() {
  $( "#end_date" ).datepicker({
    "dateFormat": "dd/mm/yy"
  });
});

// Function to initialize the timepicker with the timeformat set
$(function() {
  $("#start_time").timepicker({
    'showDuration': true,
    'timeFormat': 'G:i'
  });
});

// Function to initialize the timepicker with the timeformat set
$(function() {
  $("#end_time").timepicker({
    'showDuration': true,
    'timeFormat': 'G:i',
  });
});

// Function to toggle the visibility of the timeline
$(document).ready(
  function(){
    $("#toggle_timeline").click(function () {
      $("#timeline").toggle();
      if(timeline_visible) {
        timeline_visible = false;
        $("#toggle_timeline").text("Show Timeline");
      } else {
        timeline_visible = true;
        $("#toggle_timeline").text("Hide Timeline");
      }
    });
  }
);

// Function to toggle the visibility of the control box
$(document).ready(
  function(){
    $("#toggle_controls").click(function () {
      $("#control_box").toggle({easing: "easeOutBack"});
      if(!control_box) {
        control_box = true;
        $("#toggle_controls").text("Close Controls");
      } else {
        control_box = false;
        $("#toggle_controls").text("Open Controls");
      }
    });
  }
);

// Function for the close button on the control box
$(document).ready(
  function(){
    $("#close_button").click(function() {
      $("#toggle_controls").text("Open Controls");
      $("#control_box").toggle({easing: "easeOutBack"});
      control_box = false;
    });
  }
);

// Function for the close button on the recording box
$(document).ready(
  function(){
    $("#recording_close_button").click(function() {
      $("#recording_box").toggle({easing: "easeOutBack"});
      recording_box = false;
    });
  }
);

// Function for the close button on the picture box
$(document).ready(
  function(){
    $("#picture_close_button").click(function() {
      $("#picture_box").css("z-index", 0);
    });
  }
);


// Slideviewer jquery
var slideArray = [];
slideVersion = 0;

$(function(){
  
  slideArray[0] = $("<div />")
    .appendTo($("#picture_content"));
  
  $("<img />")
        .attr("src", "http://placehold.it/150x100")
        .appendTo(slideArray[0]);

  slideArray[0].slidesjs({
    width: 150,
    height: 100,
    pagination: {
      active: false
    },
    callback: {
      loaded: function(){
        // hide navigation and pagination
        $('.slidesjs-pagination, .slidesjs-navigation').hide(0); 
      }
    }
  });

  $('.custom-next').click(function(e) {
    e.preventDefault();
    // emulate next click
    $('.slidesjs-next').click();
  });
  $('.custom-prev').click(function(e) {
    e.preventDefault();
    // emulate previous click
    $('.slidesjs-previous').click();
  });
});