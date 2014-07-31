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
    player.body.velocity.x -= 2;
  }
  if (cursors.right.isDown) {
    player.body.velocity.x += 2;
  }
  if (cursors.down.isDown) {
    var v_x = player.body.velocity.x;
    player.body.velocity.x -= v_x/Math.abs(v_x) * 5;
  }
  if (cursors.up.isDown) {
    player.body.velocity.y += 2;
  }
}
