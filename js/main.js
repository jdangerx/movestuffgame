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
  ground.body.immovable = true;
  player = game.add.sprite(0, 0, 'bunny');
  game.physics.arcade.enable(player);
  player.body.bounce.y = 0.2;
  player.body.gravity.y = 300;
  player.body.collideWorldBounds = true;
}

function update() {
  game.physics.arcade.collide(player, platforms);
  cursors = game.input.keyboard.createCursorKeys();
  var player_v = player.body.velocity;
  if (cursors.left.isDown) {
    player_v.x -= 8;
  }
  if (cursors.right.isDown) {
    player_v.x += 8;
  }
  if (cursors.up.isDown && player.body.touching.down) {
    player_v.y = -200;
  }
  if (player.body.touching.down) {
    player_v.x *= 0.95;
  } else {
    player_v.x *= 0.98;
  }
  if (Math.abs(player_v.x) < 1) {
    player_v.x = 0;
  }
}
