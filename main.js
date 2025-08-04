const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: "#1a1a1a",
    scene: {
        preload,
        create,
        update,
    },
};

const game = new Phaser.Game(config);

function preload() {
    // Load chess piece images here
}

function create() {
    this.add.text(300, 50, "Welcome to HexChess!", {
        font: "20px Arial",
        fill: "#ffffff",
    });
}
function update() {}
