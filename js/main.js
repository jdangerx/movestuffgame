// var excuse = prompt("Why haven't you written any code yet?");
// alert("There's no game because " + excuse);
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game',
                           {preload: preload,
                            create: create,
                            update: update}, true);
var player,
    currentSwap,
    platforms,
    shift,
    w, a, s, d,
    keyboard,
    mouseWasClicked,
    cursors;

function preload() {
  game.load.image('bunny', 'img/bunny.png');
  game.load.image('invbunny', 'img/invertedbunny.png');
  game.load.image('platform', 'img/platform.png');
  // game.load.spritesheet('key', 'path/to/sprites.png');
}

function create() {
  // initialize keyboard controls
  keyboard = game.input.keyboard;
  w = keyboard.addKey(87);
  a = keyboard.addKey(65);
  s = keyboard.addKey(83);
  d = keyboard.addKey(68);
  shift = keyboard.addKey(16);
  cursors = game.input.keyboard.createCursorKeys();

  game.physics.startSystem(Phaser.Physics.ARCADE);

  immovables = game.add.group();
  immovables.enableBody = true;

  var ground = immovables.create(0, game.world.height-32, 'platform');
  ground.scale.setTo(2, 1);
  var ledge = immovables.create(100, 300, 'platform');
  ledge.scale.setTo(0.5, 1);
  var ledge = immovables.create(400, 430, 'platform');
  ledge.scale.setTo(0.5, 1);
  var ledge = immovables.create(400, 100, 'platform');
  ledge.scale.setTo(0.5, 1);

  immovables.setAll('body.immovable', true);

  movables = game.add.group()
  player = movables.create(0, 0, 'bunny');
  movables.create(600, 0, 'invbunny');
  movables.create(400, 0, 'invbunny');
  movables.create(200, 0, 'invbunny');

  game.physics.arcade.enable(movables);
  movables.setAll('inputEnabled', true);
  movables.setAll('body.gravity.y', 300);
  movables.setAll('body.bounce.y', 0.1);
  movables.setAll('body.bounce.x', 0.1);
  movables.setAll('body.mass', 0.5);
  movables.setAll('body.collideWorldBounds', true);
  movables.setAll('anchor', new Phaser.Point(0.5, 0.5));
  movables.forEach(function(movable) {
    movable.events.onInputOver.add(function() {
      if (movable != player) {
        currentSwap = movable;
      }
    }, this);
  });

  player.body.mass = 1;
  player.alpha = 1;
  player.swappable = false;
  player.maxJumps = 2;
  player.remainingJumps = 0;


  // get keycodes if you want 'em
  // game.input.keyboard.onUpCallback = function() {
    // console.log(game.input.keyboard.lastKey.keyCode);
  // };

  // for some reason calling swap here doesn't swap properly, I think it's because
  // currentSwap is set in update()
  game.input.mouse.onMouseUp = function() {
    mouseWasClicked = true;
  };
}

function swap(player, currentSwap) {
  if (!currentSwap) return;
  var temp_v,
      temp_pos,
      massRatio = player.body.mass/currentSwap.body.mass;

  console.log("swapping!");
  temp_v = currentSwap.body.velocity;
  currentSwap.body.velocity.x = player.body.velocity.x * massRatio;
  currentSwap.body.velocity.y = player.body.velocity.y * massRatio;
  player.body.velocity.x = temp_v.x / massRatio;
  player.body.velocity.y = temp_v.y / massRatio;

  temp_pos = currentSwap.body.position;
  console.log(temp_pos, player.body.position);
  currentSwap.body.position = player.body.position;
  player.body.position = temp_pos;
}

function update() {
  game.physics.arcade.collide(movables, immovables);
  game.physics.arcade.collide(movables, movables);

  // select current swap target
  var minDist = 300;
  var mousePos = game.input.mousePointer;
  movables.setAll('alpha', 0.6);
  movables.forEach(function(movable) {
    var dist = movable.body.position.distance(mousePos);
    if (dist < minDist && movable != player) {
      currentSwap = movable;
      minDist = dist;
    }
  });
  if (currentSwap) {
    currentSwap.alpha = 1;
  }
  player.alpha = 1;

  // move player

  if (player.body.touching.down) {
    player.remainingJumps = player.maxJumps;
  }

  if (cursors.left.isDown || a.isDown) {
    player.body.velocity.x -= 8;
    key_pressed = true;
  }
  if (cursors.right.isDown || d.isDown) {
    player.body.velocity.x += 8;
  }

  if ((cursors.up.isDown && cursors.up.justPressed(5)) ||
      (w.isDown && w.justPressed(5))) {
    if (player.remainingJumps > 0) {
      player.body.velocity.y = -250;
      player.remainingJumps -= 1;
    }
  }

  // perform swap
  if ((shift.isDown && shift.justPressed(10) && currentSwap) || mouseWasClicked) {
    swap(player, currentSwap);
    mouseWasClicked = false;
  }

  // friction
  movables.forEach(function(movable) {
    if (movable.body.touching.down) {
      movable.body.velocity.x *= 0.95;
    } else {
      movable.body.velocity.x *= 0.98;
    }
  });
  if (Math.abs(player.body.velocity.x) < 1) {
    player.body.velocity.x = 0;
  }

}
