class HexChessScene extends Phaser.Scene {
    constructor() {
        super({ key: 'HexChessScene' });
    }

    preload() {
        console.log('Preload started');
        // Create a simple hexagon texture
        this.createHexTexture();
        console.log('Preload finished');
    }

    create() {
        console.log('Create started');
        
        // Add title
        this.add.text(500, 50, "HexChess - Single Hexagon Test", {
            font: "24px Arial",
            fill: "#ffffff",
        }).setOrigin(0.5);

        // Create just one hexagon
        this.createSingleHex();
        console.log('Create finished');
    }

    createHexTexture() {
        const size = 30;
        
        // Create hexagon texture
        const graphics = this.add.graphics();
        this.drawHexagon(graphics, size, size, size, 0x8B4513, 0x333333);
        graphics.generateTexture('hexagon', size * 2, size * 2);
        graphics.destroy();

        console.log('Hex texture created');
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

    createSingleHex() {
        // Create one hexagon in the center
        const x = 500;
        const y = 400;
        
        const hexSprite = this.add.image(x, y, 'hexagon');
        hexSprite.setInteractive();
        
        // Add event listeners
        hexSprite.on('pointerdown', () => {
            console.log('Hexagon clicked!');
            hexSprite.setTint(0x00ff00); // Green when clicked
        });
        
        hexSprite.on('pointerover', () => {
            console.log('Hexagon hovered!');
            hexSprite.setTint(0xcccccc); // Gray when hovered
        });
        
        hexSprite.on('pointerout', () => {
            console.log('Hexagon unhovered!');
            hexSprite.clearTint(); // Back to normal
        });
        
        console.log(`Created single hexagon at (${x}, ${y})`);
    }

    update() {
        // Game update logic
    }
}

const config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 800,
    backgroundColor: "#1a1a1a",
    scene: HexChessScene
};

console.log('Starting Phaser game...');
const game = new Phaser.Game(config);
