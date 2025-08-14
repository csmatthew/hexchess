import { ColorUtils } from '../utils/ColorUtils.js';

export class ThemeManager {
    constructor(scene) {
        this.scene = scene;
        this.themes = ColorUtils.getCSSThemes();
        this.currentTheme = 'classic';
    }

    createThemeButtons() {
        const buttonContainer = document.getElementById('theme-buttons');
        
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