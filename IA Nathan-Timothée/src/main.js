let gameConfig = {
    type: Phaser.AUTO,
    width: 1920,
    height: 1080,
    backgroundColor: '#ffffff',
    parent: 'game',
    physics: {
        default: 'arcade',
        arcade: {
            debug : true,
            gravity: { y: 800},
            fps : 120
        }
    },
    scene: new Tableau1()
};
let game = new Phaser.Game(gameConfig);
