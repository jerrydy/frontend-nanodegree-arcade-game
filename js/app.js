// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    Resources.load(this.sprite);
    this.reset ();
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.movementSpeed * dt;
    // start over if enemy goes completely off the screen
    if (this.x > gameProperties.cellWidth * gameProperties.numRows) {
        this.reset();
    }

    // check if I just collided with the player
    this.checkCollision ();
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Enemy.prototype.reset = function() {

    // start just outside of the screen
    this.x = -100;

    // randomize which row the enemy will be, assumes possible range is from 1 to numRows - 2
    this.gy = Math.floor(Math.random()*(gameProperties.numRows-3)+1); 
    this.y =  this.gy * gameProperties.cellHeight - 20;

    // speed is from 100 to 600
    this.movementSpeed = Math.random() * 500 + 100;
}

Enemy.prototype.checkCollision = function() {
    // can only collide if in the same row as the player
    if (this.gy == player.gy) {
        // check if the left or right edge of the enemy touches the player
        if (this.x + Resources.get(this.sprite).width > player.gx * gameProperties.cellWidth + 25 &&
            this.x < player.gx * gameProperties.cellWidth + Resources.get(player.sprite).width - 25) {
            gameProperties.life--;
            player.reset ();
        };
    }
}


// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function() {
    this.sprite = 'images/char-boy.png'
    Resources.load(this.sprite);
    this.reset ();
}

Player.prototype.update = function (dt) {
    var score = document.querySelector("#score");
    score.innerHTML = "Score: " + gameProperties.score.toString();
    var life = document.querySelector("#life");
    life.innerHTML = "Lives: " + gameProperties.life.toString();    
    var timer = document.querySelector("#timer");
    var currentTime = new Date();
    gameProperties.timeLeft = Math.round((gameProperties.startTime.getTime() + (gameProperties.totalTime * 1000) - currentTime.getTime()) / 1000);
    timer.innerHTML = "Time Left: " + gameProperties.timeLeft.toString();
    if (gameProperties.timeLeft <= 0) {
        alert ("No time left! You scored " + gameProperties.score.toString () + " points! Click Okay to start a new game");
        this.newGame ();
    }

}

Player.prototype.render = function () {
    this.x = this.gx * gameProperties.cellWidth;
    this.y = this.gy * gameProperties.cellHeight - 10;
    ctx.drawImage(Resources.get(this.sprite), this.x , this.y);
}

Player.prototype.handleInput = function (key) {
    switch (key) {
        case "left":
            this.gx--;
            break;
        case "right":
            this.gx++;
            break;
        case "up":
            this.gy--;
            break;
        case "down":
            this.gy++;
            break;
    };
    this.checkRange ();
}

Player.prototype.reset = function () {
    // start at the center
    this.gx = Math.floor (gameProperties.numCols / 2);

    this.gy = gameProperties.numRows - 2;

    if (gameProperties.life <= 0) {
        alert ("No lives left! You scored " + gameProperties.score.toString () + " points! Click Okay to start a new game");
        this.newGame ();
    }
}

Player.prototype.checkRange = function () {
    if (this.gx < 0) {
        this.gx = 0;
    }
    if (this.gx > gameProperties.numCols - 1) {
        this.gx = gameProperties.numCols - 1;
    }
    if (this.gy > gameProperties.numRows - 1) {
        this.gy = gameProperties.numRows - 1;
    }
    if (this.gy < 1) {
        gameProperties.score += 1;
        this.reset();
    }
}

Player.prototype.newGame = function () {
    gameProperties.life = gameProperties.totalLife;
    gameProperties.score = 0;
    gameProperties.startTime = new Date ();
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

// put properties as variables so the game is more customizable
var gameProperties = {
    enemyCount: 3,
    numRows: 6,
    numCols: 5,
    cellWidth: 101,
    cellHeight: 83,
    totalLife: 3,       // total lives when a new game starts
    totalTime: 60,      // total time when a new game starts

    // following properties are updated during game play
    score: 0,
    life: 3,
    startTime: null,    // time when game started
    timeLeft: 1
};

var allEnemies = [];     // store as an array

// create the enemy objects
for (i=0; i < gameProperties.enemyCount; i++) {
    allEnemies.push (new Enemy());
}

// now the player object
var player = new Player();
player.newGame ();

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
