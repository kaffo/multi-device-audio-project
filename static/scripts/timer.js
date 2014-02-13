self.addEventListener('message', function(e) 
	{
	self.postMessage('done');
	self.close();
	var data = e.data;
	if (data.cmd==='noob')
		{
		function stateChange(newState) 
			{
    		setTimeout(function () 
    			{
        		if (newState == -1) 
        			{
        			self.postMessage('done');
            	self.close();
        			}
    			}, 500);
			}
		}
	else if (data.cmd===-1)
		{
		self.postMessage("I have -1");
		self.close();
		}
	else if (data.cmd===-2)
		{
		self.postMessage('I have -2');
		self.close()
		}

	}, false);



//////////////////////OUTDATED STUFF////////////////////
/*
self.addEventListener('message', function(e) 
	{
	var data = e.data;
	switch (data.cmd) 
		{
		case 'start':
			self.postMessage('WORKER STARTED: ' + data.msg);
			break;
		case 'stop':
			self.postMessage('WORKER STOPPED: ' + data.msg +
								'. (buttons will no longer work)');
			self.close(); // Terminates the worker.
			break;
		default:
			self.postMessage('Unknown command: ' + data.msg);
		};
	}, false);
*/
/*
function stateChange(newState) {
    setTimeout(function () {
        if (newState == -1) {
            alert('SOUND HAS STOPPED');
        }
    }, 5000);
}
*/
