
function Mouse(htmlElement)
{
	var mouseX = 0;
	var mouseY = 0;
	var pressed = false;
	var offset = $(htmlElement).offset(); 
	
	$(document).ready(function() 
	{
		$(document).mousemove(function(event)
		{
			mouseX = event.pageX - offset.left;
			mouseY = event.pageY - offset.top;
			//added this specificallly for pacman
			mouseMoved();
		});
		
		$(htmlElement).mousedown(function(event)
		{	
			pressed = true;
		});
		
		$(document).mousedown(function(event)
		{
			//prevent from selecting elements on a double click
			event.preventDefault();
		});
		
		$(document).mouseup(function()
		{
			pressed = false;
		});
	});
	
	this.getX = function()
	{
		return mouseX;
	};
	
	this.getY = function()
	{
		return mouseY;
	};
	
	this.isPressed = function()
	{
		return pressed;
	};
}
