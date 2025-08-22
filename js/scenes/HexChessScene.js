import { ThemeManager } from '../game/ThemeManager.js';
import { HexGrid } from '../game/HexGrid.js';
import { ChessPieces } from '../game/ChessPieces.js';
import { GameLogic } from '../game/GameLogic.js';

export class HexChessScene extends Phaser.Scene {
    constructor() {
        super({ key: 'HexChessScene' });
    }

    preload() {
        console.log('Preload started');
        
        // Initialize managers
        this.themeManager = new ThemeManager(this);
        this.hexGrid = new HexGrid(this, this.themeManager);
        this.chessPieces = new ChessPieces(this, this.hexGrid);
        
        this.themeManager.createThemeButtons();
        this.hexGrid.createHexTextures();
        this.chessPieces.createPieceTextures();
        
        console.log('Preload finished');
    }

    create() {
        console.log('Create started');
        this.hexGrid.createFullBoard();
        this.chessPieces.setupStartingPosition();
        
        // Initialize GameLogic
        this.gameLogic = new GameLogic(this);
        this.gameLogic.initialize(this.hexGrid, this.chessPieces);
        
        console.log('Create finished');
    }

    onThemeChanged() {
        // Called by ThemeManager when theme changes
        this.hexGrid.createHexTextures();
        this.chessPieces.createPieceTextures();
        this.hexGrid.createFullBoard();
        this.chessPieces.setupStartingPosition();
    }

    update() {
        // Game update logic
    }
}