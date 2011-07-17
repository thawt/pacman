/*
 * Functions include:
 * getX
 * getY
 * getZ
 * getXCenter - will always be an integer. rounded up if width is even
 * getYCenter - will always be an integer. rounded up if height is even
 * getZCenter - will always be an integer. rounded up if depth is even
 * getWidth
 * getHeight
 * getDepth
 * resizeWidth  - NOT IMPLEMENTED YET. positive argument to grow to the right. negative argument to shrink from the left
 * resizeHeight - NOT IMPLEMENTED YET. positive argument to grow downward. negative argument to shrink upward from bottom
 * resizeDepth  - NOT IMPLEMENTED YET. positive argument to grow deeper. negative argument to shrink shallower
 * collisionsRight
 * collisionsLeft
 * collisionsTop    - y axis, not z
 * collisionsBottom - y axis, not z
 * collisionsAbove
 * collisionsBelow
 * collisionsXY - total collisions of top, bottom, left, and right
 * collisionsAll - total collisions of top, bottom, left, right, above, and below
 * isCollidingXYWithA - NOT OPTIMIZED YET. pass an object constructor name rather than an instance of an object
 * isCollidingWithA - NOT IMPLEMENTED YET. similar to isCollidingXYWithA but also checks above and below
 * moveX - positive argument to move right. negative argument to move left
 * moveY - positive argument to move down. negative argument to move up
 * moveZ - positive argument to move deeper. negative argument to move shallower
 * moveTowardsXY
 * distanceFromX - how many pixels between X coordinate and this body's closest edge 
 * distanceFromY - how many pixels between Y coordinate and this body's closest edge
 * distanceFromXY
 * destroy - removes this body from the grid. after destroying, function calls to this body (other than isDead) will throw an error
 * isDead
 * ****************************
 * A collision occurs when two objects have adjacent grid spaces, NOT when two objects overlap.
 * The move functions will never overwrite the positions of occupied grid spaces.
 * They will return an array containing what objects the body is colliding with (empty array if none).
 * They will throw an error if you try to move the body out of bounds of the grid.
 * Note that the move functions only return what they are colliding with in the direction they are moving.
 * moveTowardsXY calls moveX and moveY so it will return collisions in both of those directions.
 * Keep in mind that collisionsAll() is more time intensive than say collisionsRight(). Only call what you need.
 */
function Body(obj, grid, x, y, z, w, h, d)
{
	var errorMessage = "\nFailed to create body.";
	if(arguments.length < 8) throw new Error("Body constructor requires eight arguments."+errorMessage);
	if(isNaN(x) || isNaN(y) || isNaN(z) || isNaN(w) || isNaN(h) || isNaN(d)) 
		throw new Error("Argument(s) is NaN."+errorMessage);
	
	var dead = false; 
	x = Math.round(x);
	y = Math.round(y);
	z = Math.round(z);
	w = Math.round(w);
	h = Math.round(h);
	d = Math.round(d);
	
	
	//check the grid to make sure this object will fit there
	var collisions;
	try{ collisions = grid.whatIsAt(x, y, z, w, h, d); }
	catch(e){e.message+=errorMessage; throw e;}
	if(collisions.length > 0) throw new CollisionError();
	//try to add the body to the grid
	try{ grid.add(obj, x, y, z, w, h, d); }
	catch(e){e.message+=errorMessage; throw e;}
	
	
	this.destroy = function() 
	{
		if(dead) throw new Error("The body is already dead.");
		
		try{ grid.remove(x, y, z, w, h, d); }
		catch(e){ e.message+="\nCannot destroy this body."; throw e; }
		
		dead = true;
	};
	
	this.isDead = function(){ return dead; };
	
	this.getX = function(){ if(dead) throw new DeadError("Cannot getX."); else return x; };
	
	this.getY = function(){ if(dead) throw new DeadError("Cannot getY."); else return y; };
	
	this.getZ = function(){ if(dead) throw new DeadError("Cannot getZ."); else return z; };
	
	this.getWidth = function(){ if(dead) throw new DeadError("Cannot getWidth."); else return w; };
	
	this.getHeight = function(){ if(dead) throw new DeadError("Cannot getHeight."); else return h; };
	
	this.getDepth = function(){ if(dead) throw new DeadError("Cannot getDepth."); else return d; };
	
	this.getXCenter = function(){ if(dead) throw new DeadError("Cannot getXCenter."); else return (x + Math.floor(w/2)); }; 
	
	this.getYCenter = function(){ if(dead) throw new DeadError("Cannot getYCenter."); else return (y + Math.floor(h/2)); };
	
	this.getZCenter = function(){ if(dead) throw new DeadError("Cannot getZCenter."); else return (z + Math.floor(d/2)); };
	
	this.resizeWidth = function()
	{
		//not implemented yet
	};
	
	this.resizeHeight = function()
	{
		//not implemented yet
	};
	
	this.resizeDepth = function()
	{
		//not implemented yet
	};
	
	this.collisionsRight = function()
	{
		var errorMessage = "\nCannot get collisions at the right.";
		if(dead) throw new DeadError(errorMessage);
		
		try{ return grid.whatIsAt(x + w, y, z, 1, h, d); }
		catch(e){ e.message+=errorMessage; throw e;}
	};
	
	this.collisionsLeft = function()
	{
		var errorMessage = "\nCannot get collisions at the left.";
		if(dead) throw new DeadError(errorMessage);
		
		try{ return grid.whatIsAt(x-1, y, z, 1, h, d); }
		catch(e){ e.message+=errorMessage; throw e;}
	};

	this.collisionsTop = function() //y axis, not z
	{
		var errorMessage = "\nCannot get collisions at the top.";
		if(dead) throw new DeadError(errorMessage);
		
		try{ return grid.whatIsAt(x, y-1, z, w, 1, d); }
		catch(e){ e.message+=errorMessage; throw e;}
	};
	
	this.collisionsBottom = function() //y axis, not z
	{
		var errorMessage = "\nCannot get collisions at the bottom.";
		if(dead) throw new DeadError(errorMessage);
		
		try{ return grid.whatIsAt(x, y + h, z, w, 1, d); }
		catch(e){ e.message+=errorMessage; throw e;}
	};
	
	this.collisionsBelow = function()
	{
		var errorMessage = "\nCannot get collisions below.";
		if(dead) throw new DeadError(errorMessage);
		
		try{ return grid.whatIsAt(x, y, z+d, w, h, 1); }
		catch(e){ e.message+=errorMessage; throw e;}
	};
	
	this.collisionsAbove = function()
	{
		var errorMessage = "\nCannot get collisions above.";
		if(dead) throw new DeadError(errorMessage);
		
		try{ return grid.whatIsAt(x, y, z-1, w, h, 1); }
		catch(e){ e.message+=errorMessage; throw e;}
	};
	
	this.collisionsXY = function()
	{
		try
		{ return this.collisionsTop().concat(this.collisionsBottom()).concat(this.collisionsLeft()).concat(this.collisionsRight()); }
		catch(e){ e.message+="\nCannot get collisionsXY."; throw e;}
	};
	
	this.collisionsAll = function()
	{
		try
		{ return this.collisionsXY().concat(this.collisionsAbove()).concat(this.collisionsBelow()); }
		catch(e){ e.message+="\nCannot get collisionsAll."; throw e;}
	};
	
	this.isCollidingXYWithA = function(Something)
	{
		/* Could be optimized by calling whatIsAt on each individual grid space 
		 * and return as soon as you've found it. If you do optimize this later, 
		 * remember to handle the if(dead) case and whatever else.
		 */
		var collisions;
		try{ collisions = this.collisionsXY(); }
		catch(e){e.message+="\nCannot determine if isCollidingXYWithA "+String(Something)+"."; throw e;}
		for(var i=0; i<collisions.length; i++)
		{
			if(collisions[i].constructor == Something) return true;
		}
		return false;
	};
	
	this.isCollidingWithA = function(Something)
	{
		
	};
	
	/*
	 * Here's my best attempt at describing the implementation of the move functions:
	 * for each "step" you want to take
	 *		check if there is anything in the way of taking one step forward
	 *			if there is: return, as an array, every different object that is there
	 *			otherwise: add one step worth to the front of the body and shave one step worth off the back end
	 *			(the front being the side that's facing the direction you are moving towards)
	 */
	this.moveX = function(howFar) 
	{
		var errorMessage = "\nCannot moveX.";
		if(dead) throw new DeadError(errorMessage);
		if(isNaN(howFar)) throw new Error("Argument to moveX is NaN."+errorMessage);
		howFar = Math.round(howFar);
		
		var collisions = new Array();
		
		if(howFar > 0) //moving right
		{
			for(var i=0; i<howFar; i++)
			{
				//check to right of body
				try{ collisions = this.collisionsRight(); }
				catch(e){ e.message+=errorMessage; throw e;}

				if(collisions.length > 0) return collisions;
				else
				{	
					try{ grid.add(obj, x + w, y, z, 1, h, d); }
					catch(e){ e.message+=errorMessage; throw e;}
					
					try{ grid.remove(x, y, z, 1, h, d); }
					catch(e){ e.message+=errorMessage; throw e;}
					
					x++;
				}
			}
		}
		else //moving left
		{
			for(var i=0; i>howFar; i--)
			{
				//check to left of body
				try{ collisions = this.collisionsLeft(); }
				catch(e){ e.message+=errorMessage; throw e;}

				if(collisions.length > 0) return collisions;
				else
				{
					try{ grid.add(obj, x-1, y, z, 1, h, d); }
					catch(e){ e.message+=errorMessage; throw e;}
					
					try{ grid.remove(x + w-1, y, z, 1, h, d); }
					catch(e){ e.message+=errorMessage; throw e;}
					
					x--;
				}
			}
		}
		return collisions; 
	};//end of moveX function
	
	this.moveY = function(howFar)
	{
		var errorMessage = "\nCannot moveY.";
		if(dead) throw new DeadError(errorMessage);
		if(isNaN(howFar)) throw new Error("Argument to moveY is NaN."+errorMessage);
		howFar = Math.round(howFar);
		
		var collisions = new Array();
		
		if(howFar > 0) //moving down
		{
			for(var i=0; i<howFar; i++)
			{
				//check for collisions on bottom
				try{ collisions = this.collisionsBottom(); }
				catch(e){ e.message+=errorMessage; throw e;}
				
				if(collisions.length > 0) return collisions;
				else
				{
					try{ grid.add(obj, x, y + h, z, w, 1, d); }
					catch(e){ e.message+=errorMessage; throw e;}
					
					try{ grid.remove(x, y, z, w, 1, d); }
					catch(e){ e.message+=errorMessage; throw e;}
					
					y++;
				}
			}
		}
		else //moving up
		{
			for(var i=0; i>howFar; i--)
			{
				//check for collisions on top
				try{ collisions = this.collisionsTop(); }
				catch(e){ e.message+=errorMessage; throw e;}
				
				if(collisions.length > 0) return collisions;
				else
				{	
					try{ grid.add(obj, x, y-1, z, w, 1, d); }
					catch(e){ e.message+=errorMessage; throw e;}
					
					try{ grid.remove(x, y + h-1, z, w, 1, d); }
					catch(e){ e.message+=errorMessage; throw e;}
					
					y--;
				}
			}
		}
		return collisions; 
	};//end of moveY function
	
	this.moveZ = function(howFar)
	{
		var errorMessage = "\nCannot moveZ.";
		if(dead) throw new DeadError(errorMessage);
		if(isNaN(howFar)) throw new Error("Argument to moveZ is NaN."+errorMessage);
		howFar = Math.round(howFar);
		
		var collisions = new Array();
		
		if(howFar > 0)
		{
			for(var i=0; i<howFar; i++)
			{
				//check deeper
				try{ collisions = this.collisionsBelow(); }
				catch(e){ e.message+=errorMessage; throw e;}
				
				if(collisions.length > 0) return collisions;
				else
				{
					try{ grid.add(obj, x, y, z+1, w, h, 1); }
					catch(e){ e.message+=errorMessage; throw e;}
					
					try{ grid.remove(x, y, z, w, h, 1); }
					catch(e){ e.message+=errorMessage; throw e;}
					
					z++;
				}
			}
		}
		else
		{
			for(var i=0; i>howFar; i--)
			{
				//check more shallow
				try{ collisions = this.collisionsAbove(); }
				catch(e){ e.message+=errorMessage; throw e;}
		
				if(collisions.length > 0) return collisions;
				else
				{					
					try{ grid.add(obj, x, y, z-1, w, h, 1); }
					catch(e){ e.message+=errorMessage; throw e;}
					
					try{ grid.remove(x, y, z, w, h, 1); }
					catch(e){ e.message+=errorMessage; throw e;}

					z--;
				}
			}
		}
		return collisions;
	};//end of moveZ function
	
	this.moveTowardsXY = function(destX, destY, speed)
	{
		var errorMessage = "\nCannot moveTowardsXY.";
		if(dead) throw new DeadError(errorMessage);
		if(isNaN(destX) || isNaN(destY) || isNaN(speed)) throw new Error("Argument passed to moveTowardsXY is NaN."+errorMessage);
		destX = Math.round(destX);
		destY = Math.round(destY);
		
		var collisionsX;
		var collisionsY;
		
		var radians = Math.atan2((destY - Math.round(this.getYCenter())), (destX - Math.round(this.getXCenter())));
		
		try{ collisionsX = this.moveX(Math.round(Math.cos(radians) * speed)); }
		catch(e){ e.message+=errorMessage; throw e; }
		
		try{ collisionsY = this.moveY(Math.round(Math.sin(radians) * speed)); }
		catch(e){ e.message+=errorMessage; throw e; }
		
		return (collisionsX.concat(collisionsY));
	};
	
	this.distanceFromX = function(pointX)
	{
		if(dead) throw new DeadError();
		if(isNaN(pointX) || pointX < 0) throw new Error("Argument passed to distanceFromX is either negative or NaN.");
		
		var value;
		
		if(pointX > this.getXCenter()) value = (pointX - (this.getXCenter() + Math.ceil(w/2) - 1));
		
		else value = (this.getXCenter() - Math.floor(w/2) - pointX);

		if(value <= 0) return 0;
		else return value;
	};
	
	this.distanceFromY = function(pointY)
	{
		if(dead) throw new DeadError();
		if(isNaN(pointY) || pointY < 0) throw new Error("Argument passed to distanceFromY is either negative or NaN.");
		
		var value;
		
		if(pointY > this.getYCenter()) value = (pointY - (this.getYCenter() + Math.ceil(h/2) - 1));
	
		else value = (this.getYCenter() - Math.floor(h/2) - pointY);
		
		if(value <= 0) return 0;
		else return value;
	};
	
	this.distanceFromXY = function(pointX, pointY)
	{
		try{ return this.distanceFromX(pointX) + this.distanceFromY(pointY); }
		catch(e){ e.message+="\nCannot get distanceFromXY."; throw e; }
	};
	
	//custom error objects
	function CollisionError()
	{ 
		this.collisions = collisions;
		this.message = "Cannot create body on occupied grid space. Check collision property (an array) of this Error object.";
	}
	CollisionError.prototype = new Error(); //we still want this to be of type Error
	
	function DeadError(moreInfo)
	{
		this.message = "Body is dead.";
		if(moreInfo) this.message+=String(moreInfo);
	}
	DeadError.prototype = new Error();
}
