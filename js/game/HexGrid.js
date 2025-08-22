import { HexMath } from '../utils/HexMath.js';
import { HexGeometry } from './HexGeometry.js';
import { HexRenderer } from './HexRenderer.js';

export class HexGrid {
    constructor(scene, themeManager) {
        this.scene = scene;
        this.renderer = new HexRenderer(scene, themeManager);
        this.hexagons = [];
        this.labelsVisible = true;
        this.selectedHex = null;
    }

    // Delegate to renderer
    createHexTextures() {
        this.renderer.createHexTextures();
    }

    createSingleHex() {
        // This method is replaced by createFullBoard()
        // Keeping for backwards compatibility
        this.createFullBoard();
    }

    createFullBoard() {
        // Clear existing hexagons
        this.clearBoard();

        const hexSize = 25;
        const centerX = 500;
        const centerY = 300;

        // Generate all hexagons for Gliński board
        const boardHexes = HexGeometry.generateGlinskiBoard();

        boardHexes.forEach((hex, index) => {
            const pixelPos = HexMath.cubeToPixel(hex, hexSize);
            const screenX = centerX + pixelPos.x;
            const screenY = centerY + pixelPos.y;

            // Create hex sprite
            const hexSprite = this.scene.add.image(screenX, screenY, 'hexagon');
            hexSprite.setScale(0.8); // Make them slightly smaller so they fit nicely
            hexSprite.setInteractive();

            // Create label for spiral index
            const label = this.scene.add.text(screenX, screenY, index.toString(), {
                fontSize: '12px',
                fill: '#000000',
                fontFamily: 'Arial',
                stroke: '#ffffff',
                strokeThickness: 2
            });
            label.setOrigin(0.5, 0.5); // Center the text
            label.setDepth(5); // Above hexagons but below pieces

            // Store hex data
            hexSprite.hexData = {
                cube: hex,
                spiralIndex: index,
                piece: null, // Will store piece data later
                screenPos: { x: screenX, y: screenY },
                label: label // Store reference to label
            };

            // Add event handlers
            this.addHexEventHandlers(hexSprite);

            // Store in array
            this.hexagons.push(hexSprite);
        });

        console.log(`Created Gliński board with ${this.hexagons.length} hexagons`);
    }

    clearBoard() {
        this.hexagons.forEach(hex => {
            if (hex.hexData && hex.hexData.label) {
                hex.hexData.label.destroy(); // Destroy the label
            }
            hex.destroy(); // Destroy the hex sprite
        });
        this.hexagons = [];

        if (this.currentHex) {
            this.currentHex.destroy();
            this.currentHex = null;
        }
    }

    addHexEventHandlers(hexSprite) {
        hexSprite.on('pointerdown', () => {
            console.log(`Hex clicked! Spiral index: ${hexSprite.hexData.spiralIndex}, Cube: (${hexSprite.hexData.cube.q}, ${hexSprite.hexData.cube.r}, ${hexSprite.hexData.cube.s})`);

            this.selectHex(hexSprite);
        });

        hexSprite.on('pointerover', () => {
            if (hexSprite !== this.selectedHex) {
                hexSprite.setTint(0xcccccc);
            }
        });

        hexSprite.on('pointerout', () => {
            if (hexSprite !== this.selectedHex) {
                hexSprite.clearTint();
            }
        });
    }

    selectHex(hexSprite) {
        // Clear previous selection
        if (this.selectedHex) {
            this.selectedHex.clearTint();
        }

        // Select new hex
        this.selectedHex = hexSprite;
        hexSprite.setTint(0x00ff00);
    }

    getHexAt(cubeCoords) {
        return this.hexagons.find(hex =>
            hex.hexData.cube.q === cubeCoords.q &&
            hex.hexData.cube.r === cubeCoords.r &&
            hex.hexData.cube.s === cubeCoords.s
        );
    }

    getHexBySpiralIndex(index) {
        return this.hexagons.find(hex => hex.hexData.spiralIndex === index);
    }

    // Toggle label visibility
    toggleLabels() {
        this.labelsVisible = !this.labelsVisible;
        this.hexagons.forEach(hex => {
            if (hex.hexData && hex.hexData.label) {
                hex.hexData.label.setVisible(this.labelsVisible);
            }
        });
        console.log(`Labels ${this.labelsVisible ? 'shown' : 'hidden'}`);
    }

    // Show/hide labels
    showLabels() {
        this.labelsVisible = true;
        this.hexagons.forEach(hex => {
            if (hex.hexData && hex.hexData.label) {
                hex.hexData.label.setVisible(true);
            }
        });
    }

    hideLabels() {
        this.labelsVisible = false;
        this.hexagons.forEach(hex => {
            if (hex.hexData && hex.hexData.label) {
                hex.hexData.label.setVisible(false);
            }
        });
    }
}