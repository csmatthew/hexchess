export class HexGrid {
    constructor(scene, themeManager) {
        this.scene = scene;
        this.themeManager = themeManager;
        this.hexagons = [];
    }

    drawHexagon(graphics, centerX, centerY, radius, fillColor, strokeColor) {
        graphics.fillStyle(fillColor);
        graphics.lineStyle(2, strokeColor);
        graphics.beginPath();
        
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            
            if (i === 0) {
                graphics.moveTo(x, y);
            } else {
                graphics.lineTo(x, y);
            }
        }
        
        graphics.closePath();
        graphics.fillPath();
        graphics.strokePath();
    }

    createHexTextures() {
        const size = 30;
        const theme = this.themeManager.getCurrentTheme();
        
        // Clear existing textures if they exist
        if (this.scene.textures.exists('hexagon')) {
            this.scene.textures.remove('hexagon');
        }
        
        const graphics = this.scene.add.graphics();
        this.drawHexagon(graphics, size, size, size, theme.light, theme.stroke);
        graphics.generateTexture('hexagon', size * 2, size * 2);
        graphics.destroy();

        console.log(`Created textures for ${theme.name} theme`);
    }

    createSingleHex() {
        // Clear existing hex if it exists
        if (this.currentHex) {
            this.currentHex.destroy();
        }
        
        const x = 500;
        const y = 400;
        
        this.currentHex = this.scene.add.image(x, y, 'hexagon');
        this.currentHex.setInteractive();
        
        this.currentHex.on('pointerdown', () => {
            console.log('Hexagon clicked!');
            this.currentHex.setTint(0x00ff00);
        });
        
        this.currentHex.on('pointerover', () => {
            console.log('Hexagon hovered!');
            this.currentHex.setTint(0xcccccc);
        });
        
        this.currentHex.on('pointerout', () => {
            console.log('Hexagon unhovered!');
            this.currentHex.clearTint();
        });
        
        console.log(`Created single hexagon at (${x}, ${y})`);
    }
}