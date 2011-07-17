/*
strawberry = super score
cherry     = score multiplier
banana     = speed up
orange     = gravity
*/

var upgradeManager; //assigned an obj in main

var upgradeWH = 22;
var upgradeImgOffset = 32-upgradeWH;
var eatUpgradeSound;//assigned an obj in main

var superscoreImg = loadSrcs("sprites/strawberry.png");
var multiplierImg = loadSrcs("sprites/cherry.png");
var speedupImg = loadSrcs("sprites/banana.png");
var gravityImg = loadSrcs("sprites/orange.png");

function UpgradeManager()
{ 
	this.superscoreSpawnInterval = fps*30;//how many update() calls it takes to make a new superscore thing
	this.multiplierSpawnInterval = fps*60;
	this.speedupSpawnInterval    = 900;//how many points it takes to make a speed up
	this.gravitySpawnInterval    = 600;//how many ponits

	this.ssCounter = 0;
	this.mCounter = 0;
	this.superscores = new Array();
	this.multipliers = new Array();
	this.speedups = new Array();
	this.gravities = new Array();
	this.maxSuperscores = 2; //constant
	this.maxMultipliers = 1; //constant
	this.maxSpeedups = 1;//constant
	this.maxGravities = 1;//constant
	
	this.suOn = false;
	this.gOn = false;
	this.suTime = fps*12; //constant
	this.gTime  = fps*12; //constant
	this.suCounter = this.suTime;
	this.gCounter  = this.gTime;
	this.speedIncrease = 2; //constant
	this.gravitySpeed = 1; //constant
	
	this.update = function()
	{
		if(this.suOn)
		{
			this.suCounter--;
			if(this.suCounter <= 0)
			{ 
				this.suOn = false; 
				this.suCounter = this.suTime; 
				bonusSpeed = 0;
			}
		}
		
		if(this.gOn)
		{
			this.gCounter--;
			if(this.gCounter <= 0)
			{ 
				this.gOn = false; 
				this.gCounter = this.gTime; 
			}
			
			//move all the coins towards pacman
			for(var i=0; i<coinManager.coins.length; i++)
			{
				coinManager.coins[i].body.moveTowardsXY(pacman.body.getXCenter(), pacman.body.getYCenter(), this.gravitySpeed);
			}
			for(var i=0; i<bigCoinManager.coins.length; i++)
			{
				bigCoinManager.coins[i].body.moveTowardsXY(pacman.body.getXCenter(), pacman.body.getYCenter(), this.gravitySpeed);
			}
			for(var i=0; i<this.superscores.length; i++)
			{
				this.superscores[i].body.moveTowardsXY(pacman.body.getXCenter(), pacman.body.getYCenter(), this.gravitySpeed);
			}
			for(var i=0; i<this.multipliers.length; i++)
			{
				this.multipliers[i].body.moveTowardsXY(pacman.body.getXCenter(), pacman.body.getYCenter(), this.gravitySpeed);
			}
			for(var i=0; i<this.speedups.length; i++)
			{
				this.speedups[i].body.moveTowardsXY(pacman.body.getXCenter(), pacman.body.getYCenter(), this.gravitySpeed);
			}
	
		}
		
		//superscore
		if(this.superscores.length <= this.maxSuperscores && ++this.ssCounter >= this.superscoreSpawnInterval)
		{
			var x;
			var y;
			var collisions;
			//find random x and y positions that are open 
			do
			{
				x = blockWH + upgradeImgOffset/2 + Math.floor(Math.random()*(canvasW-blockWH-upgradeWH-upgradeImgOffset/2)); 
				y = blockWH + upgradeImgOffset/2 + Math.floor(Math.random()*(canvasH-blockWH-upgradeWH-upgradeImgOffset/2));
				collisions = grid.whatIsAt(x, y, 0, upgradeWH, upgradeWH, 3);
			}
			while(collisions.length > 0);
			this.superscores.push(new Superscore(x, y));
			this.ssCounter = 0;
		}
		
		//multiplier
		if(scoreMultiplier < 5 && this.multipliers.length <= this.maxMultipliers && ++this.mCounter >= this.multiplierSpawnInterval)
		{
			var x;
			var y;
			var collisions;
			//find random x and y positions that are open 
			do
			{
				x = blockWH + upgradeImgOffset/2 + Math.floor(Math.random()*(canvasW-blockWH-upgradeWH-upgradeImgOffset/2)); 
				y = blockWH + upgradeImgOffset/2 + Math.floor(Math.random()*(canvasH-blockWH-upgradeWH-upgradeImgOffset/2));
				collisions = grid.whatIsAt(x, y, 0, upgradeWH, upgradeWH, 3);
			}
			while(collisions.length > 0);
			this.multipliers.push(new Multiplier(x, y));
			this.mCounter = 0;
		}
		
		//speedup
		if(this.speedups.length <= this.maxSpeedups && score >= this.speedupSpawnInterval)
		{
			var x;
			var y;
			var collisions;
			//find random x and y positions that are open 
			do
			{
				x = blockWH + upgradeImgOffset/2 + Math.floor(Math.random()*(canvasW-blockWH-upgradeWH-upgradeImgOffset/2)); 
				y = blockWH + upgradeImgOffset/2 + Math.floor(Math.random()*(canvasH-blockWH-upgradeWH-upgradeImgOffset/2));
				collisions = grid.whatIsAt(x, y, 0, upgradeWH, upgradeWH, 3);
			}
			while(collisions.length > 0);
			this.speedups.push(new Speedup(x, y));
			this.speedupSpawnInterval *=2;
		}
		
		//gravity
		if(this.gravities.length <= this.maxGravities && score >= this.gravitySpawnInterval)
		{
			var x;
			var y;
			var collisions;
			//find random x and y positions that are open 
			do
			{
				x = blockWH + upgradeImgOffset/2 + Math.floor(Math.random()*(canvasW-blockWH-upgradeWH-upgradeImgOffset/2)); 
				y = blockWH + upgradeImgOffset/2 + Math.floor(Math.random()*(canvasH-blockWH-upgradeWH-upgradeImgOffset/2));
				collisions = grid.whatIsAt(x, y, 0, upgradeWH, upgradeWH, 3);
			}
			while(collisions.length > 0);
			this.gravities.push(new Gravity(x, y));
			this.gravitySpawnInterval *=2;
		}
	};
}//end of coin manager

function Superscore(x, y)
{
	this.sprite = new Sprite(superscoreImg);
	this.body = new Body(this, grid, x, y, 2, upgradeWH, upgradeWH, 1);
	
	this.consume = function()
	{
		this.sprite.destroy();
		this.body.destroy();
		for(var i=0; i<upgradeManager.superscores.length; i++)
		{
			if(upgradeManager.superscores[i] == this) upgradeManager.superscores.splice(i, 1);
		}
	}
}

function Multiplier(x, y)
{
	this.sprite = new Sprite(multiplierImg);
	this.body = new Body(this, grid, x, y, 2, upgradeWH, upgradeWH, 1);
	
	this.consume = function()
	{
		this.sprite.destroy();
		this.body.destroy();
		for(var i=0; i<upgradeManager.multipliers.length; i++)
		{
			if(upgradeManager.multipliers[i] == this) upgradeManager.multipliers.splice(i, 1);
		}
	}
}

function Speedup(x, y)
{
	this.sprite = new Sprite(speedupImg);
	this.body = new Body(this, grid, x, y, 2, upgradeWH, upgradeWH, 1);
	
	this.consume = function()
	{
		upgradeManager.suOn = true;
		upgradeManager.suCounter = upgradeManager.suTime;
		bonusSpeed = upgradeManager.speedIncrease;
		this.sprite.destroy();
		this.body.destroy();
		for(var i=0; i<upgradeManager.speedups.length; i++)
		{
			if(upgradeManager.speedups[i] == this) upgradeManager.speedups.splice(i, 1);
		}
	}
}

function Gravity(x, y)
{
	this.sprite = new Sprite(gravityImg);
	this.body = new Body(this, grid, x, y, 2, upgradeWH, upgradeWH, 1);
	
	this.consume = function()
	{
		upgradeManager.gOn = true;
		upgradeManager.gCounter = upgradeManager.gTime;
		this.sprite.destroy();
		this.body.destroy();
		for(var i=0; i<upgradeManager.gravities.length; i++)
		{
			if(upgradeManager.gravities[i] == this) upgradeManager.gravities.splice(i, 1);
		}
	}
}

function BigCoin(x, y)
{
	this.sprite = new Sprite(bigCoinImg);
	this.body = new Body(this, grid, x, y, 2, bigCoinWH, bigCoinWH, 1);

	this.consume = function()
	{	
		this.sprite.destroy();
		this.body.destroy();
		//remove myself from array
		for(var i=0; i<bigCoinManager.coins.length; i++)
		{
			if(bigCoinManager.coins[i] == this) bigCoinManager.coins.splice(i, 1);
		}
	};
}

function BigCoinManager()
{
	this.spawnInterval = fps*50;//how many update calls
	this.maxCoins = 4;
	this.coins = new Array();
	this.counter = 0;
	
	this.update = function()
	{
		if(this.coins.length < this.maxCoins && ++this.counter >= this.spawnInterval)
		{
			var x;
			var y;
			var collisions;
			//find random x and y positions that are open 
			do
			{
				x = blockWH + bigCoinImgOffset/2 + Math.floor(Math.random()*(canvasW-blockWH-bigCoinWH-bigCoinImgOffset/2)); 
				y = blockWH + bigCoinImgOffset/2 + Math.floor(Math.random()*(canvasH-blockWH-bigCoinWH-bigCoinImgOffset/2));
				collisions = grid.whatIsAt(x, y, 0, bigCoinWH, bigCoinWH, 3);
			}
			while(collisions.length > 0);
			this.coins.push(new BigCoin(x, y));
			this.counter = 0;
		}
	};
}

function Coin(x, y)
{
	this.sprite = new Sprite(coinImg);
	this.body = new Body(this, grid, x, y, 2, coinWH, coinWH, 1);

	this.consume = function()
	{	
		this.sprite.destroy();
		this.body.destroy();
		//remove myself from array
		for(var i=0; i<coinManager.coins.length; i++)
		{
			if(coinManager.coins[i] == this) coinManager.coins.splice(i, 1);
		}
	};
}//end of Coin

function CoinManager()
{ 
	this.spawnInterval = fps;//how many update() calls it takes to make a new coin
	this.maxCoins = 10;
	this.coins = new Array();
	this.counter = 0;
	
	this.update = function()
	{
		if(this.coins.length < this.maxCoins && ++this.counter >= this.spawnInterval)
		{
			var x;
			var y;
			var collisions;
			//find random x and y positions that are open 
			do
			{
				x = blockWH + coinImgOffset/2 + Math.floor(Math.random()*(canvasW-blockWH-coinWH-coinImgOffset/2)); 
				y = blockWH + coinImgOffset/2 + Math.floor(Math.random()*(canvasH-blockWH-coinWH-coinImgOffset/2));
				collisions = grid.whatIsAt(x, y, 0, coinWH, coinWH, 3);
			}
			while(collisions.length > 0);
			this.coins.push(new Coin(x, y));
			this.counter = 0;
		}
	};
}//end of coin manager
