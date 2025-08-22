export class HexGrid {
    constructor(scene, themeManager) {
        this.scene = scene;
        this.themeManager = themeManager;
        this.hexagons = [];
        this.labelsVisible = true; // Labels visible by default
    }

    // Hexagonal coordinate utilities
    cubeDistance(a, b) {
        return Math.max(Math.abs(a.q - b.q), Math.abs(a.r - b.r), Math.abs(a.s - b.s));
    }

    cubeRing(center, radius) {
        if (radius === 0) {
            return [center];
        }

        const results = [];
        let hex = this.cubeAdd(center, this.cubeScale(this.cubeDirections[4], radius));
        
        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < radius; j++) {
                results.push({...hex});
                hex = this.cubeNeighbor(hex, i);
            }
        }
        return results;
    }

    cubeSpiral(center, radius) {
        let results = [center];
        for (let k = 1; k <= radius; k++) {
            results = results.concat(this.cubeRing(center, k));
        }
        return results;
    }

    spiralIndexStartOfRing(radius) {
        return 1 + 3 * radius * (radius - 1);
    }

    spiralIndexToRadius(index) {
        // solve for 'radius' in equation: index = 1 + 3 * radius * (radius-1)
        return Math.floor((Math.sqrt(12 * index - 3) + 3) / 6);
    }

    spiralToCube(index) {
        const center = { q: 0, r: 0, s: 0 };
        if (index === 0) return center;
        
        const radius = this.spiralIndexToRadius(index);
        const ringStart = this.spiralIndexStartOfRing(radius);
        const ring = this.cubeRing(center, radius);
        return ring[index - ringStart];
    }

    cubeToSpiral(hex) {
        const center = { q: 0, r: 0, s: 0 };
        
        // Check if it's the center
        if (hex.q === 0 && hex.r === 0 && hex.s === 0) {
            return 0;
        }
        
        const radius = this.cubeDistance(hex, center);
        const ringHexes = this.cubeRing(center, radius);
        
        for (let i = 0; i < ringHexes.length; i++) {
            if (hex.q === ringHexes[i].q && hex.r === ringHexes[i].r && hex.s === ringHexes[i].s) {
                return i + this.spiralIndexStartOfRing(radius);
            }
        }
        return -1; // Not found
    }

    // Hexagonal direction vectors (cube coordinates)
    cubeDirections = [
        { q: 1, r: -1, s: 0 }, { q: 1, r: 0, s: -1 }, { q: 0, r: 1, s: -1 },
        { q: -1, r: 1, s: 0 }, { q: -1, r: 0, s: 1 }, { q: 0, r: -1, s: 1 }
    ];

    cubeAdd(a, b) {
        return { q: a.q + b.q, r: a.r + b.r, s: a.s + b.s };
    }

    cubeScale(hex, factor) {
        return { q: hex.q * factor, r: hex.r * factor, s: hex.s * factor };
    }

    cubeNeighbor(hex, direction) {
        return this.cubeAdd(hex, this.cubeDirections[direction]);
    }

    // Generate Gliński's hex chess board (91 hexagons, radius 5)
    generateGlinskiBoard() {
        const center = { q: 0, r: 0, s: 0 };
        const boardRadius = 5;
        return this.cubeSpiral(center, boardRadius);
    }

    // Convert cube coordinates to pixel coordinates
    cubeToPixel(hex, size) {
        const x = size * (3/2 * hex.q);
        const y = size * (Math.sqrt(3)/2 * hex.q + Math.sqrt(3) * hex.r);
        return { x, y };
    }

    // Convert pixel coordinates to cube coordinates
    pixelToCube(point, size) {
        const q = (2/3 * point.x) / size;
        const r = (-1/3 * point.x + Math.sqrt(3)/3 * point.y) / size;
        const s = -q - r;
        return this.cubeRound({ q, r, s });
    }

    // Round fractional cube coordinates to nearest hex
    cubeRound(hex) {
        let q = Math.round(hex.q);
        let r = Math.round(hex.r);
        let s = Math.round(hex.s);

        const qDiff = Math.abs(q - hex.q);
        const rDiff = Math.abs(r - hex.r);
        const sDiff = Math.abs(s - hex.s);

        if (qDiff > rDiff && qDiff > sDiff) {
            q = -r - s;
        } else if (rDiff > sDiff) {
            r = -q - s;
        } else {
            s = -q - r;
        }

        return { q, r, s };
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
        const boardHexes = this.generateGlinskiBoard();
        
        boardHexes.forEach((hex, index) => {
            const pixelPos = this.cubeToPixel(hex, hexSize);
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
            
            // Use GameLogic to handle selection
            if (this.scene.gameLogic) {
                this.scene.gameLogic.handleHexSelection(hexSprite);
            }
            
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