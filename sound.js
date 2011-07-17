/*
 * pass the id of an audio element
 */
function Sound(audioId, howManyChannels)
{
	if(!howManyChannels) howManyChannels = 3;
	var nextChannel = 0;
	var channels = new Array(howManyChannels);
	var src;
	try{ src = document.getElementById(audioId).src; }
	catch(e){e.message+="\nSound not created."; throw e;}
	
	for(var i=0; i<howManyChannels; i++)
	{
		channels[i] = new Audio();
		channels[i].src = src;
	}
	
	this.play = function()
	{
		channels[nextChannel].load(); //the examples i found put this here but not sure if it should be here or after assigning src to audio element
		channels[nextChannel].play();
		if(++nextChannel >= howManyChannels) nextChannel = 0;
	};
}
/*
function Sound()
{
	this.loadQ = new Array();
	this.loadingSounds = 0;
	this.sounds = {};
	
	var channelMax = 10;
	var audioChannels = new Array();
	
	for(var i=0; i <channelMax; i++)
	{
		audioChannels[i] = new Array();
		audioChannels[i]["channel"] = new Audio();
		audioChannels[i]["finished"] = -1;
	}
	
	this.loadingSounds = function(files, callback)
	{
		var audioCallback = function(){ Sound.finished(callback); };
		
		for(var name in files)
		{
			var filename = files[name];
			this.loadingSounds++;
			var snd = new Audio();
			this.sounds[name] = snd;
			snd.addEventListener("canplaythrough", audioCallback, false);
			snd.src = filename;
			snd.load();
		}
	};
	
	this.finished = function(callback)
	{
		this.loadingSounds--;
		if(this.loadingSounds == 0)
		{
			callback();
		}
	};
	
	this.play = function(s)
	{
		for(var i=0; i<audioChannels.length; i++)
		{
			var currentTime = new Date();
			if(audioChannels["finished"] < currentTime.getTime())
			{
				audioChannels[i]["finished"] = currentTime.getTime() + this.sounds[s].duration*1000;
				audioChannels[i]["channel"].src = this.sounds[s].src;
				audioChannels[i]["channel"].load();
				audioChannels[i]["channel"].play();
				break;
			}
		}
	};
	
 	//*****************************************
	//***********ORIGINAL*********************
	//*****************************************
	
		var channel_max = 10;										// number of channels
	audiochannels = new Array();
	for (a=0;a<channel_max;a++) {									// prepare the channels
		audiochannels[a] = new Array();
		audiochannels[a]['channel'] = new Audio();						// create a new audio object
		audiochannels[a]['finished'] = -1;							// expected end time for this channel
	}
	function play_multi_sound(s) {
		for (a=0;a<audiochannels.length;a++) {
			thistime = new Date();
			if (audiochannels[a]['finished'] < thistime.getTime()) {			// is this channel finished?
				audiochannels[a]['finished'] = thistime.getTime() + document.getElementById(s).duration*1000;
				audiochannels[a]['channel'].src = document.getElementById(s).src;
				audiochannels[a]['channel'].load();
				audiochannels[a]['channel'].play();
				break;
			}
		}
	}
	
	//***************************************
	//********ANOTHER VARIATION**************
	//***************************************
	var channel_max = 6;	 // number of channels 
	var c = 0;	 // number of the next free channel 
	audiochannels = new Array(); 
		for (a=0;a<channel_max;a ) // prepare the channels
		{	  
			audiochannels[a] = new Audio();	// create a new audio object 
		} 

	function play_multi_sound(s) 
	{ 
		audiochannels[c].src = document.getElementById(s).src; 
		audiochannels[c].load(); 
		audiochannels[c].play(); 
		c = c + 1;	 // increment to the next free channel 
		if (c >= channel_max){c = 0;} // loop back to channel zero when max is reached 
	}
}
*/
