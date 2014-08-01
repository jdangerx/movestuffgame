// var excuse = prompt("Why haven't you written any code yet?");
// alert("There's no game because " + excuse);
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game',
                           {preload: preload,
                            create: create,
                            update: update});
var player,
    currentSwap,
    platforms,
    shift,
    w, a, s, d,
    keyboard,
    cursors;

function preload() {
  game.load.image('bunny', 'img/bunny.png');
  game.load.image('invbunny', 'img/invertedbunny.png');
  game.load.image('platform', 'img/platform.png');
  // game.load.spritesheet('key', 'path/to/sprites.png');
}

function create() {
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
  movables.setAll('body.bounce.y', 0.2);
  movables.setAll('body.bounce.x', 0.2);
  movables.setAll('body.mass', 0.5);
  movables.setAll('body.collideWorldBounds', true);
  movables.forEach(function(movable) {
    movable.events.onInputOver.add(function() {
      movable.alpha = 0.5;
      currentSwap = movable;
    }, this);
    movable.events.onInputOut.add(function() {
      movable.alpha = 1;
      currentSwap = undefined;
    }, this);
  });

  player.body.mass = 1;


  // get keycodes if you want 'em
  // game.input.keyboard.onUpCallback = function() {
    // console.log(game.input.keyboard.lastKey.keyCode);
  // };


}

function update() {
  game.physics.arcade.collide(movables, immovables);
  game.physics.arcade.collide(movables, movables);

  if (cursors.left.isDown || a.isDown) {
    player.body.velocity.x -= 8;
    key_pressed = true;
  }
  if (cursors.right.isDown || d.isDown) {
    player.body.velocity.x += 8;
  }
  if ((cursors.up.isDown || w.isDown) && player.body.touching.down) {
    player.body.velocity.y = -300;
  }

  if (shift.isDown && shift.justPressed(10) && currentSwap) {
    var temp_v,
        temp_pos,
        massRatio = player.body.mass/currentSwap.body.mass;

    console.log(currentSwap);
    temp_v = currentSwap.body.velocity;
    currentSwap.body.velocity.x = player.body.velocity.x * massRatio;
    currentSwap.body.velocity.y = player.body.velocity.y * massRatio;
    player.body.velocity.x = temp_v.x / massRatio;
    player.body.velocity.y = temp_v.y / massRatio;

    temp_pos = currentSwap.body.position;
    currentSwap.body.position = player.body.position;
    player.body.position = temp_pos;
  }

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
