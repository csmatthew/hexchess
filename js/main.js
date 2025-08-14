import { HexChessScene } from './scenes/HexChessScene.js';

const config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 600,
    backgroundColor: "#1a1a1a",
    parent: 'game-canvas',
    scene: HexChessScene
};

console.log('Starting Phaser game...');
const game = new Phaser.Game(config);
