// var excuse = prompt("Why haven't you written any code yet?");
// alert("There's no game because " + excuse);
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game',
                           {preload: preload,
                            create: create,
                            update: update});
var player,
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

  platforms = game.add.group();
  platforms.enableBody = true;
  var ground = platforms.create(0, game.world.height-32, 'platform');
  ground.scale.setTo(2, 1);
  ground.body.immovable = true;

  var ledge = platforms.create(100, 300, 'platform');
  ledge.body.immovable = true;
  ledge.scale.setTo(0.5, 1);

  var ledge = platforms.create(400, 430, 'platform');
  ledge.body.immovable = true;
  ledge.scale.setTo(0.5, 1);

  var ledge = platforms.create(400, 100, 'platform');
  ledge.body.immovable = true;
  ledge.scale.setTo(0.5, 1);

  player = game.add.sprite(0, 0, 'bunny');
  game.physics.arcade.enable(player);
  player.body.bounce.y = 0.2;
  player.body.gravity.y = 300;
  player.body.collideWorldBounds = true;

  other = game.add.sprite(600, 200, 'invbunny');
  game.physics.arcade.enable(other);
  other.body.bounce.y = 0.2;
  other.body.gravity.y = 300;
  other.body.collideWorldBounds = true;

  game.input.keyboard.onUpCallback = function() {
    console.log(game.input.keyboard.lastKey.keyCode);
  };


}

function update() {
  game.physics.arcade.collide(player, platforms);
  game.physics.arcade.collide(other, platforms);
  game.physics.arcade.collide(other, player);

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

  if (shift.isDown && shift.justPressed(10)) {
    var temp_v,
        temp_pos;

    temp_v = other.body.velocity;
    other.body.velocity.x = player.body.velocity.x * 2;
    other.body.velocity.y = player.body.velocity.y * 2;
    player.body.velocity.x = temp_v.x * 0.5;
    player.body.velocity.y = temp_v.y * 0.5;

    temp_pos = other.body.position;
    other.body.position = player.body.position;
    player.body.position = temp_pos;
  }

  if (player.body.touching.down) {
    player.body.velocity.x *= 0.95;
  } else {
    player.body.velocity.x *= 0.98;
  }


  if (other.body.touching.down) {
    other.body.velocity.x *= 0.95;
  } else {
    other.body.velocity.x *= 0.98;
  }

  if (Math.abs(player.body.velocity.x) < 1) {
    player.body.velocity.x = 0;
  }
}
