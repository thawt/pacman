/*
 * Make sure to pass Image objects or arrays of Image objects
 */

function Sprite(manyArgs)
{
	var dead = false;
	var context;
	var images = new Array();
	var currentIndex = 0;
	var rotation = 0;
	var cycleInterval = 1;
	var cycleCounter = 0;

	this.destroy = function() 
	{
		if(dead) throw new Error("The sprite is already dead.");
		images = null;
		dead = true;
	};
	
	this.isDead = function()
	{ 
		return dead; 
	};
	
	this.addImages = function(manyArgs)
	{
		if(dead) throw new DeadError();

		for(var i=0; i<arguments.length; i++)
		{
			if(arguments[i].constructor == Array) //array was passed
			{
				images = images.concat(arguments[i]);
			}
			else if(arguments[i].src != undefined) //image was passed (even if you didn't assign a src)
			{
				images.push(arguments[i]);
			}
			else throw new Error("Each argument passed to addImages must be an Image object or array of Images.");
		}
	};
	
	this.setCurrentImage = function(index)
	{
		if(dead) throw new DeadError();
		if(isNaN(index) || index < 0 || index >= images.length) throw new Error("Invalid index passed to setCurrentImage.");
		
		currentIndex = index;
	};
	
	this.cycle = function()
	{
		if(dead) throw new DeadError();
		
		if(currentIndex == images.length-1) currentIndex = 0;
		else currentIndex++;
	};
	
	//must be > 0
	this.setCycleInterval = function(value)
	{
		if(dead) throw new DeadError();
		if(isNaN(value) || value <=0) throw new Error("Value passed to setCycleInterval is not > zero.");

		cycleInterval = value;
	};
	
	this.update = function()
	{
		if(dead) throw new DeadError();
		if(++cycleCounter >= cycleInterval)
		{
			this.cycle();
			cycleCounter = 0;
		}
	};
	
	this.setRotation = function(radians)
	{
		if(dead) throw new DeadError();
		if(isNaN(radians) || radians > Math.PI || radians < Math.PI*-1) throw new Error("Bad value (in radians) passed to setRotation.");
		
		rotation = radians;
	};
	
	//last two arguments are optional
	//if you provide just one optional argument, both of them become that - draw(20, 20, 100); is the same as draw(20, 20, 100, 100);
	this.draw = function(canvas, x, y, w, h)
	{
		if(dead) throw new DeadError();
		try{ context = canvas.getContext("2d"); }
		catch(e){ e.message+="\nInvalid canvas argument passed to draw."; throw e;}
		if(isNaN(x) || isNaN(y) || x < 0 || y < 0) throw new Error("Both x and y passed to draw must be > zero.");
		if(w === undefined) w = images[currentIndex].width;
		if(h === undefined) h = images[currentIndex].height;
		if(isNaN(w) || isNaN(h) || w < 0 || h < 0) throw new Error("Both width and height of sprite must be > zero.");
		
		if(rotation != 0)
		{
			context.translate(x + w/2, y + h/2);
			context.rotate(rotation);
			context.drawImage(images[currentIndex], -w/2, -h/2, w, h);
			context.rotate(-1*rotation);
			context.translate(-1*(x + w/2), -1*(y + h/2));
		}
		else context.drawImage(images[currentIndex], x, y, w, h);
	};
	
	this.drawCentered = function(canvas, x, y, w, h)
	{
		if(isNaN(x) || isNaN(y) || x < 0 || y < 0) throw new Error("Both x and y passed to drawCentered must be > zero.");
		var newX = x - Math.floor(images[currentIndex].width/2);
		var newY = y - Math.floor(images[currentIndex].height/2);
		try{ this.draw(canvas, newX, newY, w, h); }
		catch(e){e.message+="\nCannot drawCentered."; throw e;}
	};

	//add arguments passed to constructor
	for(var i=0; i<arguments.length; i++)
	{
		this.addImages(arguments[i]);
	}
	
	function DeadError()
	{
		this.message = "Sprite is dead.";
	}
	DeadError.prototype = new Error();
}
