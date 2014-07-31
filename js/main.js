// var excuse = prompt("Why haven't you written any code yet?");
// alert("There's no game because " + excuse);
var game = new Phaser.Game(800, 600, Phaser.AUTO, '',
                           {preload: preload,
                            create: create,
                            update: update});
var player,
    platforms,
    cursors;

function preload() {
  game.load.image('bunny', 'img/bunny.png');
  game.load.image('platform', 'img/platform.png');
  // game.load.spritesheet('key', 'path/to/sprites.png');
}


function create() {
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

  player = game.add.sprite(0, 0, 'bunny');
  game.physics.arcade.enable(player);
  player.body.bounce.y = 0.2;
  player.body.gravity.y = 300;
  player.body.collideWorldBounds = true;
}

function update() {
  game.physics.arcade.collide(player, platforms);
  cursors = game.input.keyboard.createCursorKeys();
  if (cursors.left.isDown) {
    player.body.velocity.x -= 8;
  }
  if (cursors.right.isDown) {
    player.body.velocity.x += 8;
  }
  if (cursors.up.isDown && player.body.touching.down) {
    player.body.velocity.y = -300;
  }
  if (player.body.touching.down) {
    player.body.velocity.x *= 0.95;
  } else {
    player.body.velocity.x *= 0.98;
  }
  if (Math.abs(player.body.velocity.x) < 1) {
    player.body.velocity.x = 0;
  }
}
