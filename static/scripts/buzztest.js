//hardcoded solution to the buzz problem

//alert("This script is working");
var mySounds = new Array();//array holding all the records to be played
var workers = new Array(); //array holding reference to the workers
var current = 0;//number of file currently playing


function start()//button start is pressed 
	{
	current=0;
   //worker.postMessage({'cmd': 'start', 'msg': 'Hi'});
	//var startTime = new Date().getTime();
	var mySound1 = new buzz.sound( "../../static/data/test1.ogg");
	var mySound2 = new buzz.sound("../../static/data/second_audio.ogg");
	var mySound3 = new buzz.sound("../../static/data/Second Audio Test.ogg");

	//populate the array with all sounds we want to play
	mySounds.push(mySound1);
	mySounds.push(mySound2);
	mySounds.push(mySound3);
	
	//load the first recording
	mySounds[0].load();
	
	//recursive function to call all the recordings and play them
	function playSound()
		{
		console.log("now playing " + (current+1));
		mySounds[current].play();
		current++;
		
		if (mySounds.length > current)
			{
			mySounds[current].load();
			//var worker = new Worker('../../static/scripts/timer.js');
			//workers.push(worker);
			workers.push(new Worker('../../static/scripts/timer.js'));
			workers[workers.length-1].addEventListener('message', function(e) 
				{
				console.log(e.data.cmd);
				if (e.data.cmd === 'done')
					{
					playSound();					
  				}, false);
			workers[workers.length-1].postMessage({'cmd': 1000, 'msg': 'Work'});
			}
		}
	playSound(0);
	}
	
	function stop()//terminate all recordings and empty array
	{
	
	//worker.postMessage({'cmd': 'stop', 'msg': 'Bye'});
	for (var i=mySounds.length-1;i>=0;i--)
		{
		mySounds[i].stop();	//stop all records
		mySounds.splice(i,1);//remove all records and wait for start
		}
	for (var i=0;i<workers.length;i++)
		{
		workers[i].terminate()//this script would stop the workers.
		}
	}
	
	function pause() 
	{
	//worker.postMessage({'cmd': 'foobard', 'msg': '???'});
	for (var i=current-1;i>=0;i--)
		{
		if (!mySounds[i].isEnded())
			{
			mySounds[i].togglePlay();
			}
		else break;
		}	
	}




////////////////////////////////////////////////////////////////

///////////    OUTDATED STUFF THAT MIGHT BE USEFUL  ////////////

////////////////////////////////////////////////////////////////
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
/*
for (var i=0;i<mySounds.length;i++)
	{
	mySounds[i].stop();
	}
*/


//if (!mySounds[0].isEnded())
//	{
//	alert("the sound has not ended!");
//	}

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


