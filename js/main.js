// var excuse = prompt("Why haven't you written any code yet?");
// alert("There's no game because " + excuse);
var game = new Phaser.Game(800, 600, Phaser.AUTO, '',
                           {preload: preload,
                            create: create,
                            update: update});
var player,
    cursors;

function preload() {
  game.load.image('bunny', 'img/bunny.png');
  // game.load.spritesheet('key', 'path/to/sprites.png');
}

function create() {
  game.physics.startSystem(Phaser.Physics.ARCADE);
  player = game.add.sprite(0, 0, 'bunny');
  game.physics.arcade.enable(player);
  player.body.bounce.y = 0.2;
  player.body.gravity.y = 300;
  player.body.collideWorldBounds = true;
}

function update() {
  cursors = game.input.keyboard.createCursorKeys();
  if (cursors.left.isDown) {
    player.body.velocity.x -= 8;
  }
  if (cursors.right.isDown) {
    player.body.velocity.x += 8;
  }
  if (cursors.up.isDown) {
    if (player.body.velocity.y >= -5) {
      player.body.velocity.y = -200;
    }
  }
  player.body.velocity.x *= 0.95;
  if (Math.abs(player.body.velocity.x) < 1) {
    player.body.velocity.x = 0;
  }
}
