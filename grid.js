/*
 * Each grid space should represent a pixel on the canvas with the addition of a Z axis for depth or layers
 * 
 * Functions of grid are:
 * getWidth()
 * getHeight()
 * getDepth()
 * add(obj, x, y, z, w, h, d) - also returns an array of objects that were replaced. empty array is returned if none were there
 * remove(x, y, z, w, h, d)   - also returns an array of objects that were removed. empty array is returned if none were removed
 * purge() - remove every object from the grid and return an array of objects that were removed
 * whatIsAt(x, y, z, w, h, d)
 * resizeWidth(howMuch)  - positive argument to grow. negative argument to shrink
 * resizeHeight(howMuch) - positive argument to grow. negative argument to shrink
 * resizeDepth(howMuch)  - positive argument to grow. negative argument to shrink
 * 
 * All of these functions throw errors with messages specifying what when wrong but when you catch them
 * on the front end you should have some kind a graceful fail so the player doesn't see nonsense. 
 * 
 * Note: from an implementation point of view, locations in the grid with nothing there have the value null.
 * null is different from undefined as far as identity (===) goes. So if you make any changes here, keep in
 * mind that empty grid locations should always be null and never undefined.
 */

function Grid(width, height, depth)
{
	depth = depth || 1;
	if(isNaN(width) || isNaN(height) || isNaN(depth)) throw new Error("NaN passed to grid constructor.");
	if(width <= 0 || height <= 0 || depth <= 0) throw new Error("Negative number or zero passed to grid constructor.");
	
	var cube = new Array(Math.round(depth)); //this will be the 3d array
	
	for(var i=0; i<cube.length; i++)
	{
		cube[i] = new Array(Math.round(width));
		
		for(var j=0; j<cube[i].length; j++)
		{
			cube[i][j] = new Array(Math.round(height));
			
			for(var k=0; k<cube[i][j].length; k++)
			{
				cube[i][j][k] = null;
			}
		}
	}
	//done building the empty cube
	
	this.getWidth = function(){ return cube[0].length; };
	
	this.getHeight = function(){ return cube[0][0].length; };
	
	this.getDepth = function(){ return cube.length; };
	
	this.add = function(obj, x, y, z, w, h, d)
	{
		try{ return gridWork(this, x, y, z, w, h, d, obj); }
		catch(e){e.message+="add."; throw e;}
	};
	
	this.remove = function(x, y, z, w, h, d)
	{
		try {return gridWork(this, x, y, z, w, h, d, null);}
		catch(e){e.message+="remove."; throw e;}
	};
	
	this.purge = function()
	{
		try { return this.remove(0, 0, 0, this.getWidth()-1, this.getHeight()-1, this.getDepth()-1); }
		catch(e){e.message+="purge."; throw e;}
	};
	
	this.whatIsAt = function(x, y, z, w, h, d)
	{
		try{ return gridWork(this, x, y, z, w, h, d); }
		catch(e){e.message+="whatIsAt."; throw e;}
	};
	
	//negative argument to shrink
	//careful, if you shrink the grid you could be killing whatever used to be there
	this.resizeWidth = function(howMuch)
	{
		if(isNaN(howMuch) || howMuch == 0 || howMuch <= (this.getWidth() *-1)) throw new Error("Bad value passed to resizeWidth in grid.");
		
		if(howMuch > 0) //increasing size
		{
			var addition = new Array(howMuch);
			//fill addition with null values
			for(var i=0; i<addition.length; i++)
			{ 
				addition[i] = new Array(this.getHeight());
				
				for(var j=0; j<this.getHeight(); j++)
				{
					addition[i][j] = null;
				}
			}
			
			for(var i=0; i<this.getDepth(); i++)
			{
				cube[i] = cube[i].concat(addition);
			}
		}
		else //shrinking
		{	
			for(var i=0; i<this.getDepth(); i++)
			{
				cube[i].splice( (this.getWidth()+howMuch), howMuch*-1);
			}
		}
	};
	
	this.resizeHeight = function(howMuch)
	{
		if(isNaN(howMuch) || howMuch == 0 || howMuch <= (this.getHeight() *-1)) throw new Error("Bad value passed to resizeHeight in grid.");
		
		if(howMuch > 0)//increasing size
		{
			var addition = new Array(howMuch);
			//fill addition with null values
			for(var i=0; i<addition.length; i++)
			{
				addition[i] = null; 
			}
			
			for(var i=0; i<this.getDepth(); i++)
			{
				for(var j=0; j<this.getWidth(); j++)
				{
					cube[i][j] = cube[i][j].concat(addition);
				}
			}
		}
		else//shrinking
		{
			for(var i=0; i<this.getDepth(); i++)
			{
				for(var j=0; j<this.getWidth(); j++)
				{
					cube[i][j].splice( (this.getHeight()+howMuch), howMuch*-1);
				}
			}
		}
	};
	
	this.resizeDepth = function(howMuch)
	{
		if(isNaN(howMuch) || howMuch== 0 || howMuch <= (this.getDepth() *-1)) throw new Error("Bad value passed to resizeDepth in grid.");
		
		if(howMuch > 0)//increasing size1
		{
			var addition = new Array(howMuch);
			//fill addition with null values
			for(var i=0; i<addition.length; i++)
			{
				addition[i] = new Array(this.getWidth());
				
				for(var j=0; j<this.getWidth(); j++)
				{
					addition[i][j] = new Array(this.getHeight());
					
					for(var k=0; k<cube[i][j].length; k++)
					{
						addition[i][j][k] = null;
					}
				}
			}
			
			cube = cube.concat(addition);
		}
		else//shrinking
		{
			cube.splice(this.getDepth()+howMuch, howMuch*-1);
		}
	};
	
	//private function that returns what is within the range
	//the last argument is optional; if you do provide it, that argument will replace everything within the range
	function gridWork(that, x, y, z, w, h, d, obj)
	{	
		//validate inputs
		if(isNaN(x) || isNaN(y) || isNaN(z) || isNaN(w) || isNaN(h) || isNaN(d)) throw new Error("NaN passed to grid function: ");
		x = Math.round(x);
		y = Math.round(y);
		z = Math.round(z);
		w = Math.round(w);
		h = Math.round(h);
		d = Math.round(d);
		if(x < 0 || y < 0 || z < 0 || w <= 0 || h <= 0 || d <= 0) throw new Error("Negative number or zero passed to grid function: ");
		if(x + w -1 >= that.getWidth()) throw new Error("Selection range out of bounds on X coordinate in grid function: ");
		if(y + h -1 >= that.getHeight()) throw new Error("Selection range out of bounds on Y coordinate in grid function: ");
		if(z + d -1 >= that.getDepth()) throw new Error("Selection range out of bounds on Z coordinate in grid function: ");
		//done validating inputs
		
		var contents = new Array();
		
		for(var i=z; i<(z + d); i++)
		{
			for(var j=x; j<(x + w); j++)
			{
				for(var k=y; k<(y + h); k++)
				{
					if(cube[i][j][k] != null)
					{
						//don't put redundant entries into contents
						var alreadyThere = false;
						for(l=0; l<contents.length; l++)
						{
							if(contents[l] == cube[i][j][k]) alreadyThere = true;
						}
						if(!alreadyThere) contents.push(cube[i][j][k]);
					}
					if(obj !== undefined) cube[i][j][k] = obj;
				}
			}
		}
		return contents;
	}
}