var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.CANVAS, 'war-of-the-old-omes', {
    preload: preload,
    create: create,
    update: update,
    render: render
});

function preload() {
    game.load.image('background', 'assets/floor.jpg');
    game.load.image('bullet', 'assets/bullet.png');
    game.load.spritesheet('ms', 'assets/player/sheet.png', 32, 32);
}

var player;
var cursors;
var fireButton;
var socket;

function create() {

    socket = io.connect(location.href);

    game.add.tileSprite(0, 0, 1920, 1920, 'background');
    game.world.setBounds(0, 0, 1920, 1920);
    game.physics.startSystem(Phaser.Physics.P2JS);

    player = new Player(null, 'Player');
    player.create();

    game.physics.p2.enable(player.sprite);

    fireButton = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
    cursors = game.input.keyboard.createCursorKeys();

    game.camera.follow(player.sprite, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);

    firebase.auth().onAuthStateChanged(function(user) {

        if (user) {
            player.id = user.uid;
            player.nick = user.displayName;
            player.playerName.text = user.displayName;
            $('#modalRegister').modal('hide');
            $('#modalLogin').modal('hide');

        } else {

            $('#modalRegister').modal('toggle');

        }

    });

    // socket actions

    // One of the players are moving
    // Move or create new sprite
    socket.on('playerMovement', function(data){
      console.log(data);
    });

    // One of the player is disconnected
    // Destroy the sprites and the player
    socket.on('disconnection', function(data){

    });

    // One of the player is dead
    // Destroy the sprites and the player
    socket.on('death', function(data){

    });

}

function update() {
  player.listenMovement();
  player.alignName();
}

function render() {
    game.debug.text("Arrows to move.", 20, 20);
}
