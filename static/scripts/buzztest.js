alert("This script is working");

var mySound = new buzz.sound( "../../static/data/test1.ogg", 
	{	
	preload: true,autoplay: false
	});
var mySound2 = new buzz.sound("../../static/data/second_audio.ogg",
	{
	preload: true, autoplay:false
	})

///////////////////// play factory ///////////////////
mySound.unmute();
//mySound.setVolume(10);
mySound.load();
mySound.play();

mySound.bind("timeupdate", function(e) {
    //var percent = buzz.toPercent( this.getTime(), this.getDuration() ),
    //    message = "Stopped or paused at " + percent + "%";
    //document.getElementById("percent").innerHTML = message;
    var seconds = mySound.getTime();
    //console.log("this sux");
    if (seconds>7 && confirm("stop?")===true && seconds )
    	{mySound.stop();
		mySound2.play();}
    	//mySound2.stop();
    console.log(mySound.getTime());
    });

///////////////////// timer factory ////////////////////


