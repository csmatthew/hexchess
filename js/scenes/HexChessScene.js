import { ThemeManager } from '../game/ThemeManager.js';
import { HexGrid } from '../game/HexGrid.js';

export class HexChessScene extends Phaser.Scene {
    constructor() {
        super({ key: 'HexChessScene' });
    }

    preload() {
        console.log('Preload started');
        
        // Initialize managers
        this.themeManager = new ThemeManager(this);
        this.hexGrid = new HexGrid(this, this.themeManager);
        
        this.themeManager.createThemeButtons();
        this.hexGrid.createHexTextures();
        
        console.log('Preload finished');
    }

    create() {
        console.log('Create started');
        this.hexGrid.createSingleHex();
        console.log('Create finished');
    }

    onThemeChanged() {
        // Called by ThemeManager when theme changes
        this.hexGrid.createHexTextures();
        this.hexGrid.createSingleHex();
    }

    update() {
        // Game update logic
    }
}