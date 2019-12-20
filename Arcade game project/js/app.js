
// Enemies our player must avoid
var Enemy = function(x,y,speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.sprite = 'images/enemy-bug.png';
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    this.x += (this.speed*dt);
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.


};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function (x,y) {
    this.x = x;
    this.y = y;
    this.sprite = 'images/char-boy.png'; 
}

Player.prototype.update = function (dt) {
}

Player.prototype.handleInput = function (PressedKey) {
     if (PressedKey == 'left' && this.x > 0) {
        // pressed left
        this.x -=100;
    }

    if (PressedKey == 'right' && this.x < 400) {
        // pressed right
        this.x +=100;
    }

    if (PressedKey == 'up' && this.y > -20) {
        // pressed up
        this.y -=80;
    }

    if (PressedKey == 'down' && this.y < 380) {
        // pressed down
        this.y +=80;
    }



};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

var score = 1;
var waterplace = false;

function increaseScore () {
    var scorenumber = document.getElementById('scorenumber');
    if (waterplace == true) {
        score += 1;    
    }
} 


function success () {
    waterplace = true;
    var modal = document.getElementById('success-modal');
    scorenumber.innerHTML = "Score: "+score;
    modal.style.display = 'block';
    setTimeout( function(){
        modal.style.display = 'none';
    }, 1500);
}



// reset method for the player - back to start when player reaches the water
Player.prototype.resetPlayer = function() {
    var that= this;
    if (this.y < 55) {
        console.log('YOU WON!')

       success();
       setTimeout(function(){
            that.y = 380;
            increaseScore();
        }, 750);
       
    } 
};





// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
// player object
var player = new Player (200, 380);
// an array so that createEnemies() function can access
var allEnemies = [];


// a function that will create enemies
function createEnemy () {
    console.log('creating enemies')
    for (var i = 0; i < 5; i++) {
        var enemy = new Enemy(enemyLocation(), enemyRow(), enemySpeed());
        allEnemies.push(enemy);
    }
};

createEnemy();
// a function to check number of enemies then add more when enemies are passed to the end
// it also handle collisions
window.setInterval(function checkenemies() {
    for (var k = 0; k < allEnemies.length; k++) {
                if (allEnemies[k].x > 505) {
                    allEnemies.splice(k, 1);
                    var nextWave = new Enemy(enemyLocation(), enemyRow(), enemySpeed());
                    allEnemies.push(nextWave);
                }
            }
                waterplace = false;
                player.resetPlayer();
                collision();

 
}, 50);

// a function to determine if collision has occured between a player and an enemy
function collision () {
     for (var i = 0; i < allEnemies.length; i++) {
        if (allEnemies[i].y > player.y-20 && allEnemies[i].y < player.y+20 && allEnemies[i].x < player.x+60 && allEnemies[i].x > player.x-60) {
            player.y = 380;
            // collision occured
        }
    }
}



// a function for enemy's speed which is random
var EnemySpeed;
function enemySpeed () {
    EnemySpeed = (Math.random()*250)+100;
    return EnemySpeed; 


}

// a function to determine which row the enemy will take
function enemyRow() {
    row = Math.round(Math.random()*3);
    if (row === 3) {
        return 225;
    }
    else if (row === 2) {
        return 140;
    }
    else if (row === 1) {
        return 55;
    }
    else {
        console.log("Zero");
        return enemyRow();
    }
}

var spawn;

//specify enemy's locations - these are random points
function enemyLocation() {
     spawn = -Math.round((Math.random()*1000)+10);
         for (var j = 0; j < allEnemies.length; j++) {
            if (spawn > (allEnemies[j].x - 100) && spawn < (allEnemies[j].x + 100)) {
                enemyLocation();
            } else {
                return spawn;
            }           
         }
     }


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


