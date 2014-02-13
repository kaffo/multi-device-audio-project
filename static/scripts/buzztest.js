//hardcoded solution to the buzz problem
alert("This script is working");

var startTime = new Date().getTime();
var mySounds = new Array();
var current = 0;//number of file currently playing

var mySound1 = new buzz.sound( "../../static/data/test1.ogg", 
	{	
	preload: false,autoplay: false
	});
var mySound2 = new buzz.sound("../../static/data/second_audio.ogg",
	{
	preload: false, autoplay:false
	});
var mySound3 = new buzz.sound("../../static/data/Second Audio Test.ogg",
	{
	preload: false, autoplay:false
	});
	
//populate an array with all sounds we want to play
mySounds.push(mySound1);
mySounds.push(mySound2);
mySounds.push(mySound3);

//load all sounds

for (var i=0;i<mySounds.length;i++)
	{
	mySounds[i].load();
	}
	
//load the first sound
mySounds[0].load();

function playSound(current)
	{
	console.log("now playing " + (current+1));
	mySounds[current].play();
	current++;
	if (mySounds.length > current)
		{
		mySounds[current].load();
		playSound(current);
		}
	}

playSound(0);

//play all sounds to test they work
/*
for (var i=0;i<mySounds.length;i++)
	{
	mySounds[i].play();
	}
*/
//console.log(mySounds[0].getTime());
//console.log(startTime);

//stop all sounds

for (var i=0;i<mySounds.length;i++)
	{
	mySounds[i].stop();
	}











//if (!mySounds[0].isEnded())
//	{
//	alert("the sound has not ended!");
//	}

///////////////////// play factory ///////////////////
//mySound.unmute();
//mySound.setVolume(10);
//mySound.load();
//mySound.play();

//mySound.bind("timeupdate", function(e) {
    //var percent = buzz.toPercent( this.getTime(), this.getDuration() ),
    //    message = "Stopped or paused at " + percent + "%";
    //document.getElementById("percent").innerHTML = message;
//    var seconds = mySound.getTime();
    //console.log("this sux");
//    if (seconds>3)
//    	{mySound.stop();
		//mySound2.play();
    	//mySound2.stop();
    	//}
    //console.log(mySound.getTime());
    //});

///////////////////// timer factory ////////////////////


