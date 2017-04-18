//**************************************************
// Class that controls the x and y positions of any
// game character.
//**************************************************
var Position = function(x, y){
	this.x = x;
	this.y = y;
};

//Indicates if the character can make a move.
Position.prototype.checkBoundaries = function(direction){
	switch(direction)
	{
		case 'up':
			return this.y > 80;
		case 'down':
			return this.y < 400;
		case 'left':
			return this.x > 5;
		case 'right':
			return this.x < 400;
	}
};
//**************************************************


//**************************************************
// Base class for any object that has to be
// draw on screen.
//**************************************************
var ScreenObject = function(x, y, sprite){
	this.position = new Position(x, y);
	this.sprite = sprite;
};

ScreenObject.prototype.render = function(){
	ctx.drawImage(Resources.get(this.sprite), this.position.x, this.position.y);
};
//**************************************************


//**************************************************
// Enemies our player must avoid
//**************************************************
var Enemy = function(x, y, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

	ScreenObject.call(this, x, y, 'images/enemy-bug.png');
	this.moveTo = 'right';
	this.speed = Math.floor((Math.random() * 400) + 300); //Got from: https://www.w3schools.com/jsref/jsref_random.asp
};
Enemy.prototype = Object.create(ScreenObject.prototype);

//Change the enemy's direction (left/right)
Enemy.prototype.changeDirection = function(){
	if(this.moveTo === 'left'){
		this.moveTo = 'right';
		this.sprite = 'images/enemy-bug.png';
	}
	else{
		this.moveTo = 'left';
		this.sprite = 'images/enemy-bug-02.png';
	}
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
	if(!this.position.checkBoundaries(this.moveTo))
		this.changeDirection();

	if(this.moveTo == 'left')
		this.position.x -= (this.speed*dt);
	else if(this.moveTo == 'right')
		this.position.x += (this.speed*dt);

	this.collisionCheck(player);

};

//Logic got from: https://discussions.udacity.com/t/implement-the-collision-detection-as-an-enemy-method-instead-of-player/213976
Enemy.prototype.collisionCheck = function(currentPlayer) {

	var absoluteDistanceX = Math.abs(currentPlayer.position.x - this.position.x);
	var absoluteDistanceY = Math.abs(currentPlayer.position.y - this.position.y);

    if (absoluteDistanceX < 55 && absoluteDistanceY < 55) {
		hearts = [];
		currentPlayer.points = 0;
        currentPlayer.reset();
	}
};
//**************************************************


//**************************************************
// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
//**************************************************
var Player = function(x, y){
	ScreenObject.call(this, x, y, 'images/char-boy.png');

	this.points = 0;
};
Player.prototype = Object.create(ScreenObject.prototype);

Player.prototype.update = function(){

};

// Moves the player
Player.prototype.handleInput = function(direction){

	if(!this.position.checkBoundaries(direction))
		return;

	switch(direction)
	{
		case 'up':
			this.position.y -= 85;
			break;
		case 'down':
			this.position.y += 85;
			break;
		case 'left':
			this.position.x -= 100;
			break;
		case 'right':
			this.position.x += 100;
			break;
	}

	if(this.position.x == 200 && this.position.y == 60){
		this.goal();
	}
};

//Resets the player's position
Player.prototype.reset = function(){
	this.position.x = 200;
	this.position.y = 400;
};

//Gave a point to the player
Player.prototype.goal = function(){
	hearts.push(new Heart(this.points++ * 100, 5));
	this.reset();
};
//**************************************************


//**************************************************
// Princess class
//**************************************************
var Princess = function(x, y){
	ScreenObject.call(this, x, y, 'images/char-princess-girl.png');
};
Princess.prototype = Object.create(ScreenObject.prototype);
//**************************************************

//**************************************************
// Heart class
//**************************************************
var Heart = function(x, y){
	ScreenObject.call(this, x, y, 'images/Heart.png');
};
Heart.prototype = Object.create(ScreenObject.prototype);
//**************************************************

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
var allEnemies = [new Enemy(400, 145), new Enemy(0, 230), new Enemy(250, 310)];

var hearts = [];

// Place the player object in a variable called player
var player = new Player(200, 400);

var princess = new Princess(200, 70);


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});