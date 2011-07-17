/*
 * ***********************************************************************************************
 *
 * I usually don't write code this sloppy but I just wanted to get it done.
 * Maybe one day when i get really really bored I'll clean this up.
 *
 * **********************************************************************************************
 */
var paused;
var soundOn = true;
var playerName = "";
var gameOver;
var docReady = false;
var usingMouse = true; //whether pacman should look at mouse or not
var upgradeManager;
var submitCount;
var score;
var scoreMultiplier;
var bonusSpeed; //applies to pacman
var fps = 30;
var currentTime; //in milliseconds. don't use Date object in case fps slows down
var canvas;
var canvasW;
var canvasH;
var context;
var mouser;
var grid;
var pacman;
var blocks; //array containing all blocks
var coinManager;
var bigCoinManager;
var ghostManager;
var scoreShowManager;
var startSound;
var overSound;
var eatCoinSound;
var eatBigCoinSound;
var eatGhostSound;
//some constants
var pacWH = 30; //pacman's width and height of body. sprite is 48x48
var blockWH = 32;//same as sprite
var coinWH = 16; //sprite is 26x26
var bigCoinWH=30;//sprite is 40x40
var ghostWH = 32;//sprite is 43x43
//offsets so bodies are centered with the center of sprite when drawing; assuming sprite is bigger than body 
var pacImgOffset = 48-pacWH;
var blockImgOffset = 0;
var coinImgOffset = 26-coinWH;
var bigCoinImgOffset = 40-bigCoinWH;
var ghostImgOffset = 43-ghostWH;
//directions for key presses
var w = false;
var a = false;
var s = false;
var d = false;
var al = false;//arrow left
var ar = false; //arrow right
var ad = false; //arrow down
var au = false; //arrow up

//****Load Images*****//
function loadSrcs(manyArgs) //returns an array if more than one argument
{
	var img;
	var imgs = new Array();
	for(var i=0; i<arguments.length; i++)
	{
		img = new Image();
		img.src = arguments[i];
		imgs.push(img);
	}
	if(imgs.length == 1) return img;
	else return imgs;
}

var pacmanImgs = loadSrcs("sprites/pacman/a.png", "sprites/pacman/b.png", "sprites/pacman/c.png", "sprites/pacman/d.png");
var blockImg = loadSrcs("sprites/block.png");
var coinImg = loadSrcs("sprites/coin.png");
var bigCoinImg = loadSrcs("sprites/bigCoin.png");
var redImgs = loadSrcs("sprites/ghosts/red/NE.png", "sprites/ghosts/red/SE.png", "sprites/ghosts/red/SW.png", "sprites/ghosts/red/NW.png",
	"sprites/ghosts/red/NE1.png", "sprites/ghosts/red/SE1.png", "sprites/ghosts/red/SW1.png", "sprites/ghosts/red/NW1.png");
var blueImgs = loadSrcs("sprites/ghosts/blue/NE.png", "sprites/ghosts/blue/SE.png", "sprites/ghosts/blue/SW.png", "sprites/ghosts/blue/NW.png", 
	"sprites/ghosts/blue/NE1.png", "sprites/ghosts/blue/SE1.png", "sprites/ghosts/blue/SW1.png", "sprites/ghosts/blue/NW1.png");
var greenImgs = loadSrcs("sprites/ghosts/green/NE.png", "sprites/ghosts/green/SE.png", "sprites/ghosts/green/SW.png", "sprites/ghosts/green/NW.png",
	"sprites/ghosts/green/NE1.png", "sprites/ghosts/green/SE1.png", "sprites/ghosts/green/SW1.png", "sprites/ghosts/green/NW1.png");
//var fearImg = loadSrcs("sprites/ghosts/scared.png");
//var fearDoneImg = loadSrcs("sprites/ghosts/scaredDone.png");
var fearImgs = loadSrcs("sprites/ghosts/scared.png", "sprites/ghosts/scared1.png");
var fearDoneImgs = loadSrcs("sprites/ghosts/scaredDone.png", "sprites/ghosts/scaredDone1.png");


//****Start the game****//

$(document).ready(function()
{	
	$("#pause").hide();
	$("#facebookLike").hide();
	getScores(10);
	$("#canvasDiv").slideUp("slow");
	
	//arrow keys or WASD 
	$(document).keydown(function(event){
		//prevent default on arrow keys so page doesn't scroll when moving pacman
		//up
		if(event.keyCode == "38"){ event.preventDefault(); au = true; }
		if(event.keyCode == "87") w = true;
		//down
		if(event.keyCode == "40"){ event.preventDefault(); ad = true; }
		if(event.keyCode == "83") s = true;
		//left
		if(event.keyCode == "37"){ event.preventDefault(); al = true; }
		if(event.keyCode == "65") a = true;
		//right
		if(event.keyCode == "39"){ event.preventDefault(); ar = true; }
		if(event.keyCode == "68") d = true;
	});
	
	$(document).keyup(function(event){
		event.preventDefault();
		//up
		if(event.keyCode == "38") au = false;
		if(event.keyCode == "87") w = false;
		//down
		if(event.keyCode == "40") ad = false;
		if(event.keyCode == "83") s = false;
		//left
		if(event.keyCode == "37") al = false;
		if(event.keyCode == "65") a = false;
		//right
		if(event.keyCode == "39") ar = false;
		if(event.keyCode == "68") d = false;
	});
	
	docReady = true; 
});



/*
 * The grid used has 3 layers. pacman exists on layers 1 and 2. blocks exist on layer 1 and coins exist on layer 2
 * so pacman can collide with coins and blocks. When a new ghost is spawned, he spawns on layer 0 because he 
 * kind of floats above the blocks as he enters. As soon as a ghost isn't floating above anything,
 * he moves his entire body down to level 1 so he can collide with pacman and with blocks, but not coins. 
 * This kind of demonstrates using a 3D grid for a 2D game with layered objects. 
 */

function main()
{	
	
	//fps = 30;
	paused = false;
	gameOver = false;
	score = 0;
	scoreMultiplier = 1;
	bonusSpeed = 0;
	currentTime = 0;
	submitCount = 0;

	canvas = document.getElementById("canvas");
	canvasW = canvas.getAttribute("width");
	canvasH = canvas.getAttribute("height");
	context = canvas.getContext("2d");
	context.font = "bold 14px sans-serif";
	mouser = new Mouse(canvas);
	//mouser = new Mouse(document.getElementById("body"));
	grid = new Grid(canvasW, canvasH, 3); //three layers
	createBorder();
	pacman = new Pacman();
	coinManager = new CoinManager();
	bigCoinManager = new BigCoinManager();
	ghostManager = new GhostManager();
	scoreShowManager = new ScoreShowManager();
	upgradeManager = new UpgradeManager();
	
	//i hate IE
	if(navigator.appName == "Microsoft Internet Explorer")
	{
		startSound = new Sound("gamestartIE", 1);
		overSound = new Sound("gameoverIE", 1);
		eatCoinSound = new Sound("eatCoinIE", 3);
		eatBigCoinSound = new Sound("eatBigCoinIE", 2);
		eatGhostSound = new Sound("eatGhostIE", 5);
		eatUpgradeSound = new Sound("eatUpgradeIE", 2);
	}
	else
	{
		startSound = new Sound("gamestart", 1);
		overSound = new Sound("gameover", 1);
		eatCoinSound = new Sound("eatCoin", 3);
		eatBigCoinSound = new Sound("eatBigCoin", 2);
		eatGhostSound = new Sound("eatGhost", 5);
		eatUpgradeSound = new Sound("eatUpgrade", 2);
	}
	
	if(soundOn) startSound.play();
	loop();
}

function loop()
{
	if(!gameOver)
	{
		var startTime = new Date(); //number of milliseconds since midnight January 1, 1970
		
		if(!paused)
		{

			currentTime += (1000 / fps);
			$("#info").html("Time: "+Math.round(currentTime/1000)+
				"&nbsp;&nbsp;&nbsp;&nbsp;"+"Score: "+score+
				"&nbsp;&nbsp;&nbsp;&nbsp;"+"Multiplier: X"+scoreMultiplier);
			
			pacman.update();
			coinManager.update();
			bigCoinManager.update();
			ghostManager.update();
			upgradeManager.update();
			
		
			//draw everything
			context.fillStyle = "black";
			context.fillRect(0, 0, canvasW, canvasH);//clear previous drawing
			
			for(var i=0; i<blocks.length; i++)//draw each block
			{
				blocks[i].sprite.draw(canvas, blocks[i].body.getX()-blockImgOffset/2, blocks[i].body.getY()-blockImgOffset/2);
			}
			
			var coins = coinManager.coins;
			for(var i=0; i<coins.length; i++)//draw each coin
			{
				coins[i].sprite.draw(canvas, coins[i].body.getX()-coinImgOffset/2, coins[i].body.getY()-coinImgOffset/2);
			}
			
			var bcoins = bigCoinManager.coins;
			for(var i=0; i<bcoins.length; i++)
			{
				bcoins[i].sprite.draw(canvas, bcoins[i].body.getX()-bigCoinImgOffset/2, bcoins[i].body.getY()-bigCoinImgOffset/2);	
			}
			
			var ss = upgradeManager.superscores;
			for(var i=0; i<ss.length; i++)
			{
				ss[i].sprite.draw(canvas, ss[i].body.getX()-upgradeImgOffset/2, ss[i].body.getY()-upgradeImgOffset/2);
			}
			
			var sm = upgradeManager.multipliers;
			for(var i=0; i<sm.length; i++)
			{
				sm[i].sprite.draw(canvas, sm[i].body.getX()-upgradeImgOffset/2, sm[i].body.getY()-upgradeImgOffset/2);
			}
			
			var su = upgradeManager.speedups;
			for(var i=0; i<su.length; i++)
			{
				su[i].sprite.draw(canvas, su[i].body.getX()-upgradeImgOffset/2, su[i].body.getY()-upgradeImgOffset/2);
			}
			
			var g = upgradeManager.gravities;
			for(var i=0; i<g.length; i++)
			{
				g[i].sprite.draw(canvas, g[i].body.getX()-upgradeImgOffset/2, g[i].body.getY()-upgradeImgOffset/2);
			}
			
			pacman.sprite.draw(canvas, pacman.body.getX()-pacImgOffset/2, pacman.body.getY()-pacImgOffset/2);
			
			var g = ghostManager.ghosts;
			for(var i=0; i<g.length; i++)
			{
				g[i].sprite.draw(canvas, g[i].body.getX()-ghostImgOffset/2, g[i].body.getY()-ghostImgOffset/2);
			}
			scoreShowManager.update();
			//done drawing
		}
		else //paused
		{
			//context.fillStyle = "yellow";
			//context.fillText("Paused", canvasW/2, canvasH/2);
		}
		var endTime = new Date();
		var timeDif = endTime - startTime;
		//each loop should consume 17ms max (1000 / 60 = 16.666) for 60fps
		setTimeout("loop()", ((Math.round(1000 / fps)) - timeDif));
	}

}

function Pacman()
{
	this.speed = 6;
	this.sprite = new Sprite(pacmanImgs);
	this.sprite.setCycleInterval(2);
	
	this.body = new Body(this, grid, (grid.getWidth()/2-(pacWH/2)), (grid.getHeight()/2-(pacWH/2)), 1, pacWH, pacWH, 2);//start at center of canvas

	this.update = function()
	{
		if(au || ad || al || ar || w || a || s || d)
		{
			usingMouse = false;
			var x = this.body.getXCenter();
			var y = this.body.getYCenter(); 
			if((au || w) && !(ad || s)) y = y - pacWH; 
			if((ad || s) && !(au || w)) y = y + pacWH;
			if((ar || d) && !(al || a)) x = x + pacWH;
			if((al || a) && !(ar || d)) x = x - pacWH;
			
			
			if(this.body.distanceFromXY(x, y) > 1) //condition is needed bc center of pacman is not exactly centered (bc pacman's w & h are even)
			{
				this.sprite.setRotation(Math.atan2((y - Math.round(this.body.getYCenter())), (x - Math.round(this.body.getXCenter()))));
				this.body.moveTowardsXY(x, y, this.speed+bonusSpeed);
				this.sprite.update();
			}
			
		}
		else if(mouser.isPressed()) 
		{
			var x = (mouser.getX() >= 0) ? mouser.getX() : 0;
			var y = (mouser.getY() >= 0) ? mouser.getY() : 0;
			
			if(this.body.distanceFromXY(x, y) >= 1)
			{
				this.body.moveTowardsXY(x, y, this.speed+bonusSpeed); 

				this.sprite.update();
			}
		}
		if(usingMouse) this.sprite.setRotation(Math.atan2((mouser.getY() - Math.round(this.body.getYCenter())), (mouser.getX() - Math.round(this.body.getXCenter()))));
		
		var collisions = this.body.collisionsXY();
		for(var i=0; i<collisions.length; i++)
		{
			if(collisions[i].constructor == Coin)
			{
				collisions[i].consume();
				if(soundOn) eatCoinSound.play();
				score += 10 * scoreMultiplier;
				scoreShowManager.addShow(10*scoreMultiplier, this.body.getXCenter(), this.body.getYCenter(), "silver");
			}
			else if(collisions[i].constructor == BigCoin)
			{
				ghostManager.scaredToAll();
				collisions[i].consume();
				if(soundOn) eatBigCoinSound.play();
				score += 15 * scoreMultiplier;
				scoreShowManager.addShow(15*scoreMultiplier, this.body.getXCenter(), this.body.getYCenter(), "silver");
			}
			else if(collisions[i].constructor == Superscore)
			{
				collisions[i].consume();
				if(soundOn) eatUpgradeSound.play();
				score += 100 * scoreMultiplier;
				scoreShowManager.addShow(100*scoreMultiplier, this.body.getXCenter(), this.body.getYCenter(), "red");
				
			}
			else if(collisions[i].constructor == Multiplier)
			{
				collisions[i].consume();
				if(soundOn) eatUpgradeSound.play();
				scoreMultiplier++;
				scoreShowManager.addShow("Multiplier", this.body.getXCenter(), this.body.getYCenter(), "red"); 
				
			}
			else if(collisions[i].constructor == Speedup)
			{
				collisions[i].consume();
				if(soundOn) eatUpgradeSound.play();
				scoreShowManager.addShow("Speed +", this.body.getXCenter(), this.body.getYCenter(), "yellow");
			}
			else if(collisions[i].constructor == Gravity)
			{
				collisions[i].consume();
				if(soundOn) eatUpgradeSound.play();
				scoreShowManager.addShow("Gravity", this.body.getXCenter(), this.body.getYCenter(), "orange");
			}
			else if(collisions[i].constructor == Ghost)
			{
				if(collisions[i].scared)//ghost is running away
				{
					collisions[i].consume();
					if(soundOn) eatGhostSound.play();
					score += 25 *scoreMultiplier;
					scoreShowManager.addShow(25*scoreMultiplier, this.body.getXCenter(), this.body.getYCenter(), "blue");
				}
				else
				{
					gameOver = true;
					if(soundOn) overSound.play();
					$("#canvasDiv").fadeTo(1000,0);
					$("#canvasDiv").slideUp("slow");
					$("#playerVals").slideDown("slow");
					$("#playerVals").html(
					"Your Score: "+score +"<br /><br />"+
					"Your Time: "+Math.round(currentTime/1000) +"<br /><br />"+
					"Your Name: "+"<br /><br />"+
					"<form onSubmit=\"submitScore(); return false;\">"+ 
						"<input id=\"nameInput\" type=\"text\" name=\"nameInput\" maxlength=\"17\" />"+
						"<input type=\"submit\" value=\"Submit\" />"+
					"</form>");
					$("#highScores").slideDown("slow");
					$("#info").html("Game Over");
					$("#start").show();
					$("#pause").hide();
					$("#howToPlay").hide();
					$("#facebookLike").show();
					$("#nameInput").focus();
					$("#nameInput").blur(function(){$("#nameInput").focus();});
					document.getElementById("nameInput").value = playerName;
				}
			}
		}

	};
}//end of pacman

function Ghost(speed)
{
	this.spriteCycleInterval = fps/4;//a constant
	
	if(speed <= 0) speed = 1;
	if(speed >= 6) speed = 5;
	
	this.speed = speed;
	this.scared = false;
	this.scaredCountdown;
	
	this.sprite; //current
	this.ne;
	this.se;
	this.sw;
	this.nw;

	this.scaredSprite = new Sprite(fearImgs);
	this.scaredDoneSprite = new Sprite(fearImgs, fearDoneImgs);
	this.scaredSprite.setCycleInterval(this.spriteCycleInterval);
	this.scaredDoneSprite.setCycleInterval(this.spriteCycleInterval/4); //faster because it blinks
	
	
	switch(Math.floor(Math.random()*3)) //random color sprite
	{
	case 2:
		this.ne = new Sprite(redImgs[0], redImgs[4]);
		this.se = new Sprite(redImgs[1], redImgs[5]);
		this.sw = new Sprite(redImgs[2], redImgs[6]);
		this.nw = new Sprite(redImgs[3], redImgs[7]);
		break;
	case 1:
		this.ne = new Sprite(blueImgs[0], blueImgs[4]);
		this.se = new Sprite(blueImgs[1], blueImgs[5]);
		this.sw = new Sprite(blueImgs[2], blueImgs[6]);
		this.nw = new Sprite(blueImgs[3], blueImgs[7]);
		break;
	default:
		this.ne = new Sprite(greenImgs[0], greenImgs[4]);
		this.se = new Sprite(greenImgs[1], greenImgs[5]);
		this.sw = new Sprite(greenImgs[2], greenImgs[6]);
		this.nw = new Sprite(greenImgs[3], greenImgs[7]);
	}
	
	this.ne.setCycleInterval(this.spriteCycleInterval);
	this.sw.setCycleInterval(this.spriteCycleInterval);
	this.se.setCycleInterval(this.spriteCycleInterval);
	this.nw.setCycleInterval(this.spriteCycleInterval);
	this.sprite = this.se; //needs a default
	
	//ghosts are on layer 1 of the grid. blocks and coins are on layer 0. pacman is on 0 and 1. 
	//this way, the ghost won't collide with blocks and coins but can still collide with pacman
	this.body = new Body(this, grid, canvasW/2, ghostImgOffset/2, 0, ghostWH, ghostWH, 1);
	
	this.update = function()
	{
		if(this.body.getZ() == 0) //on the shallowest layer. move down if possible
		{
			var b = this.body; //shorter variable name
			var collisions = grid.whatIsAt(b.getX(), b.getY(), 1, b.getWidth(), b.getHeight(), 1);
			if(collisions.length == 0) this.body.moveZ(1);
			else //check if collision is with pacman
			{
				for(var i=0; i<collisions.length; i++)
				{
					if(collisions[i].constructor == Pacman)
					{
						gameOver = true;
						if(soundOn) overSound.play();
						$("#canvasDiv").fadeTo(1000,0);
						$("#canvasDiv").slideUp("slow");
						$("#playerVals").slideDown("slow");
						$("#playerVals").html(
						"Your Score: "+score +"<br /><br />"+
						"Your Time: "+Math.round(currentTime/1000) +"<br /><br />"+
						"Your Name: "+"<br /><br />"+
						"<form onSubmit=\"submitScore(); return false;\">"+ 
							"<input id=\"nameInput\" type=\"text\" name=\"nameInput\" maxlength=\"17\" />"+
							"<input type=\"submit\" value=\"Submit\" />"+
						"</form>");
						$("#highScores").slideDown("slow");
						$("#info").html("Game Over");
						$("#start").show();
						$("#facebookLike").show();
						$("#pause").hide();
						$("#howToPlay").hide();
						$("#nameInput").focus();
						$("#nameInput").blur(function(){$("#nameInput").focus();});
						document.getElementById("nameInput").value = playerName;
					}
				}
			}
		}
		
		var dir; //direction that pacman is in relative to this ghost
		if(pacman.body.getXCenter() > this.body.getXCenter())//east
		{
			if(pacman.body.getYCenter() > this.body.getYCenter()) dir = 1;//se
			else dir = 0;//ne
		}
		else //west
		{
			if(pacman.body.getYCenter() > this.body.getYCenter()) dir = 2;//sw
			else dir = 3; //nw
		}
		
		if(this.scared && this.body.getZ() == 1) 
		{
		
			if(this.scaredCountdown > fps*1.5) this.sprite = this.scaredSprite;
			else this.sprite = this.scaredDoneSprite;
			
			this.sprite.update(); //blinking blue & white
			
			switch(dir)
			{
			case 0: 
				this.body.moveTowardsXY(0, canvasH, this.speed);
				break;
			case 1:
				this.body.moveTowardsXY(0, 0, this.speed);
				break;
			case 2:
				this.body.moveTowardsXY(canvasW, 0, this.speed);
				break;
			default:
				this.body.moveTowardsXY(canvasW, canvasH, this.speed);
			}
			
			if(this.scaredCountdown > 0)
			{
				this.scaredCountdown--;
				if(this.scaredCountdown == 0) this.scared = false;
			}
		}
		else //ghost isn't scared
		{
			switch(dir)
			{
			case 0:
				this.sprite = this.ne;
				break;
			case 1:
				this.sprite = this.se;
				break;
			case 2:
				this.sprite = this.sw;
				break;
			default:
				this.sprite = this.nw;
			}
			this.sprite.update();
			
			this.body.moveTowardsXY(pacman.body.getXCenter(), pacman.body.getYCenter(), this.speed);
		}
		
		/* moved this up so it only happens if scared == true
		if(this.scaredCountdown > 0)
		{
			this.scaredCountdown--;
			if(this.scaredCountdown == 0) this.scared = false;
		}
		*/
	};//end of update()
	
	this.consume = function()
	{
		this.sprite.destroy();
		this.body.destroy();
		//remove myself from array
		for(var i=0; i<ghostManager.ghosts.length; i++)
		{
			if(ghostManager.ghosts[i] == this) ghostManager.ghosts.splice(i, 1);
		}
	};
}//end of ghost

function GhostManager()
{
	this.spawnInterval = 10;//not a constant. this number will be dropped when score gets higher
	this.rate = 4/(1000*60);//a faster rate means that ghosts will be spawned with higher speeds sooner
	this.scaredTime = fps*8;
	this.maxGhosts = 12;
	this.ghosts = new Array();
	var counter = 0;
	this.threshHold = 2500; //when threshHold is reached, drop the spawn interval
	
	this.update = function()
	{
		for(var i=0; i<this.ghosts.length; i++)
		{
			this.ghosts[i].update();
		}
		if(this.ghosts.length < this.maxGhosts && ++counter >= fps*this.spawnInterval)
		{
			
			var ghostSpeed = Math.floor(currentTime*this.rate);
			this.ghosts.push(new Ghost(ghostSpeed));
			counter = 0;
		}
		//when player starts getting a really high score, start making ghosts more often
		if(score >= this.threshHold)
		{
			this.spawnInterval -=1;
			this.threshHold *=2;
		}
	};
	
	this.scaredToAll = function()
	{
		for(var i=0; i<this.ghosts.length; i++)
		{
			if(this.ghosts[i].body.getZ() == 1)
			{
				this.ghosts[i].scared = true;
				this.ghosts[i].scaredCountdown = this.scaredTime;
			}
		}
	};
}


function createBorder() //populate the borders of the canvas with blocks
{
	blocks = new Array();
	for(var i=0; i<=canvasW-blockWH; i+=blockWH) //create blocks across the top and bottom
	{
		//create one on top
		var block = new function()
		{
			this.sprite = new Sprite(blockImg);//from load
			this.body = new Body(this, grid, i, 0, 1, blockWH, blockWH, 1);
		};
		blocks.push(block);
		
		//create one on bottom
		block = new function()
		{
			this.sprite = new Sprite(blockImg);//from load
			this.body = new Body(this, grid, i, canvasH-blockWH, 1, blockWH, blockWH, 1);
		};
		blocks.push(block);
	}
	for(var i=blockWH; i<=canvasH-blockWH*2; i+=blockWH) //create blocks along the sides
	{
		//create one on the left
		var block = new function()
		{
			this.sprite = new Sprite(blockImg);//from load
			this.body = new Body(this, grid, 0, i, 1, blockWH, blockWH, 1);
		};
		blocks.push(block);
		
		//create one on right
		block = new function()
		{
			this.sprite = new Sprite(blockImg);//from load
			this.body = new Body(this, grid, canvasW-blockWH, i, 1, blockWH, blockWH, 1);
		};
		blocks.push(block);
	}	
}//done creating border

function togglePause()
{
	if(paused && !gameOver)
	{
		$("#pause").html("Pause");
		paused = false;
		$("#canvasDiv").fadeTo("slow",1);
	}
	else if(!gameOver)
	{
		$("#pause").html("Unpause");
		paused = true;
		$("#canvasDiv").fadeTo("slow",0.25);
	}
}

function toggleSound()
{
	if(soundOn) soundOn = false;
	else soundOn = true;
}

function start()
{
	if(docReady)
	{
		$("#pause").show();
		$("#start").hide();//hide the start button
		$("#highScores").slideUp("slow");
		$("#canvasDiv").slideDown("slow");
		$("#canvasDiv").fadeTo(1000,1);
		main();
	}
}

function getScores(top)
{
	$.ajax({
		type: "GET",
		url: "getScores.php",
		data: "top="+top,
		success: function(msg){ $("#top10").html(msg); }
	});
}

function submitScore()
{
	if(submitCount++ == 0)
	{
		playerName = document.getElementById("nameInput").value || "Derp";
	
		$("#playerVals").slideUp();
	
		$.ajax({
			type: "GET",
			url: "addScore.php",
			data: "n="+playerName+"&s="+score+"&t="+Math.round(currentTime/1000),
			success: function(msg){ 
				$("#playerVals").slideUp("slow");
				getScores(10);
			}
		});
	}
}

function ScoreShow(value, x, y, color)
{
	this.counter = 0;
	this.timeCounter = 0;
	 
	this.update = function()
	{
		if(this.counter++ >= 3)//scoreShowManager.rate)
		{
			y = y -2;
			this.counter = 0;
		}
		
		context.fillStyle = color || "yellow";
		context.fillText(value, x, y);
		
		if(this.timeCounter++ >= scoreShowManager.displayTime)
		{
			//remove myself from array
			for(var i=0; i<scoreShowManager.shows.length; i++)
			{
				if(scoreShowManager.shows[i] == this) scoreShowManager.shows.splice(i, 1);
			}
		}
	}
}

function ScoreShowManager()
{
	this.shows = new Array();
	this.displayTime = fps*1.5;
	this.rate = fps/10; //distance the score thing goes on the y axis (in pix)
	
	this.addShow = function(value, x, y, color)
	{
		this.shows.push(new ScoreShow(value, x, y, color));
	}
	
	this.update = function()
	{
		for(var i=0; i<this.shows.length; i++)
		{
			this.shows[i].update();
		}
	}
}

function mouseMoved()
{
	usingMouse = true;
}
