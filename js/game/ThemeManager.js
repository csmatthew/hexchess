import { ColorUtils } from '../utils/ColorUtils.js';

export class ThemeManager {
    constructor(scene) {
        this.scene = scene;
        this.themes = ColorUtils.getCSSThemes();
        this.currentTheme = 'classic';
        this.devMode = true; // Start in dev mode by default
    }

    createThemeButtons() {
        const buttonContainer = document.getElementById('theme-buttons');
        
        // Create theme buttons
        Object.keys(this.themes).forEach(themeKey => {
            const button = document.createElement('button');
            button.className = 'theme-button';
            button.textContent = this.themes[themeKey].name;
            button.onclick = () => this.changeTheme(themeKey);
            
            if (themeKey === this.currentTheme) {
                button.classList.add('active');
            }
            
            buttonContainer.appendChild(button);
        });
        
        // Add separator
        const separator = document.createElement('div');
        separator.style.height = '10px';
        buttonContainer.appendChild(separator);
        
        // Add dev mode toggle button
        const devModeButton = document.createElement('button');
        devModeButton.className = 'theme-button dev-mode-toggle';
        devModeButton.textContent = 'Dev Mode: ON';
        devModeButton.style.backgroundColor = '#4CAF50';
        devModeButton.onclick = () => this.toggleDevMode(devModeButton);
        buttonContainer.appendChild(devModeButton);
        
        // Add individual toggle buttons (initially visible in dev mode)
        const labelButton = document.createElement('button');
        labelButton.className = 'theme-button label-toggle dev-control';
        labelButton.textContent = 'Hide Labels';
        labelButton.onclick = () => this.toggleLabels(labelButton);
        buttonContainer.appendChild(labelButton);
        
        const pieceButton = document.createElement('button');
        pieceButton.className = 'theme-button piece-toggle dev-control';
        pieceButton.textContent = 'Hide Pieces';
        pieceButton.onclick = () => this.togglePieces(pieceButton);
        buttonContainer.appendChild(pieceButton);
    }

    toggleDevMode(button) {
        this.devMode = !this.devMode;
        
        // Update button appearance
        button.textContent = this.devMode ? 'Dev Mode: ON' : 'Dev Mode: OFF';
        button.style.backgroundColor = this.devMode ? '#4CAF50' : '#f44336';
        
        // Show/hide dev control buttons
        const devControls = document.querySelectorAll('.dev-control');
        devControls.forEach(control => {
            control.style.display = this.devMode ? 'inline-block' : 'none';
        });
        
        // If turning off dev mode, ensure labels and pieces are visible
        if (!this.devMode) {
            this.scene.hexGrid.showLabels();
            this.scene.chessPieces.showPieces();
            
            // Update button texts
            const labelButton = document.querySelector('.label-toggle');
            const pieceButton = document.querySelector('.piece-toggle');
            if (labelButton) labelButton.textContent = 'Hide Labels';
            if (pieceButton) pieceButton.textContent = 'Hide Pieces';
        }
        
        console.log(`Dev Mode: ${this.devMode ? 'ON' : 'OFF'}`);
    }

    toggleLabels(button) {
        if (!this.devMode) return; // Only allow in dev mode
        
        this.scene.hexGrid.toggleLabels();
        button.textContent = this.scene.hexGrid.labelsVisible ? 'Hide Labels' : 'Show Labels';
    }

    togglePieces(button) {
        if (!this.devMode) return; // Only allow in dev mode
        
        this.scene.chessPieces.togglePieces();
        button.textContent = this.scene.chessPieces.piecesVisible ? 'Hide Pieces' : 'Show Pieces';
    }

    changeTheme(newTheme) {
        console.log(`Changing theme to: ${newTheme}`);
        this.currentTheme = newTheme;
        
        // Update HTML
        document.getElementById('current-theme').textContent = 
            `Current Theme: ${this.themes[this.currentTheme].name}`;
        
        // Update button styles
        document.querySelectorAll('.theme-button').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');
        
        // Notify scene to update
        this.scene.onThemeChanged();
    }

    getCurrentTheme() {
        return this.themes[this.currentTheme];
    }
}