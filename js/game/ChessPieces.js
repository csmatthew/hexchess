export class ChessPieces {
    constructor(scene, hexGrid) {
        this.scene = scene;
        this.hexGrid = hexGrid;
        this.pieces = new Map(); // Map spiral index to piece data
        this.piecesVisible = true; // Pieces visible by default
    }

    // Gliński's hex chess starting positions (spiral indices)
    getStartingPositions() {
        return {
            // White pieces (bottom half of board)
            white: {
                pawns: [85, 56, 33, 16, 5, 14, 29, 50, 77], // 9 pawns
                rooks: [84, 78],
                knights: [83, 79],
                bishops: [81, 53, 31],
                queen: 82,
                king: 80,
            },
            // Black pieces (top half of board)
            black: {
                pawns: [70, 44, 24, 10, 2, 8, 20, 38, 62], // 9 pawns
                rooks: [69, 63],
                knights: [68, 64],
                bishops: [66, 41, 22],
                queen: 67,
                king: 65,
            }
        };
    }

    // Create piece textures
    createPieceTextures() {
        const pieceSize = 20;
        const pieces = ['king', 'queen', 'rook', 'bishop', 'knight', 'pawn'];
        const colors = ['white', 'black'];

        pieces.forEach(piece => {
            colors.forEach(color => {
                const textureKey = `${color}_${piece}`;
                
                // Clear existing texture if it exists
                if (this.scene.textures.exists(textureKey)) {
                    this.scene.textures.remove(textureKey);
                }

                const graphics = this.scene.add.graphics();
                this.drawPiece(graphics, piece, color, pieceSize);
                graphics.generateTexture(textureKey, pieceSize * 2, pieceSize * 2);
                graphics.destroy();
            });
        });

        console.log('Created chess piece textures');
    }

    // Simple piece drawing (you can enhance this with better graphics)
    drawPiece(graphics, piece, color, size) {
        const fillColor = color === 'white' ? 0xffffff : 0x333333;
        const strokeColor = color === 'white' ? 0x000000 : 0xffffff;

        graphics.fillStyle(fillColor);
        graphics.lineStyle(2, strokeColor);

        switch (piece) {
            case 'king':
                // Draw crown shape
                graphics.fillCircle(size, size, size * 0.7);
                graphics.fillRect(size * 0.5, size * 0.5, size, size * 0.3);
                break;
            case 'queen':
                // Draw larger crown
                graphics.fillCircle(size, size, size * 0.6);
                graphics.fillTriangle(size, size * 0.4, size * 0.7, size * 0.7, size * 1.3, size * 0.7);
                break;
            case 'rook':
                // Draw castle battlements
                graphics.fillRect(size * 0.4, size * 0.4, size * 1.2, size * 1.2);
                graphics.fillRect(size * 0.3, size * 0.3, size * 0.4, size * 0.4);
                graphics.fillRect(size * 1.3, size * 0.3, size * 0.4, size * 0.4);
                break;
            case 'bishop':
                // Draw mitre shape
                graphics.fillCircle(size, size, size * 0.5);
                graphics.fillTriangle(size, size * 0.3, size * 0.7, size * 0.8, size * 1.3, size * 0.8);
                break;
            case 'knight':
                // Draw horse head shape
                graphics.fillEllipse(size, size, size * 0.8, size * 1.2);
                graphics.fillTriangle(size * 1.3, size * 0.7, size * 1.6, size * 0.4, size * 1.6, size);
                break;
            case 'pawn':
                // Draw simple circle
                graphics.fillCircle(size, size, size * 0.4);
                break;
        }

        graphics.strokePath();
        graphics.fillPath();
    }

    // Set up starting position
    setupStartingPosition() {
        this.clearAllPieces();
        const positions = this.getStartingPositions();

        // Place white pieces
        this.placePieces(positions.white, 'white');
        
        // Place black pieces
        this.placePieces(positions.black, 'black');

        console.log('Set up starting position for Gliński hex chess');
    }

    placePieces(piecePositions, color) {
        // Place pawns
        piecePositions.pawns.forEach(index => {
            this.placePiece(index, 'pawn', color);
        });

        // Place other pieces
        this.placePiece(piecePositions.rooks[0], 'rook', color);
        this.placePiece(piecePositions.rooks[1], 'rook', color);
        this.placePiece(piecePositions.knights[0], 'knight', color);
        this.placePiece(piecePositions.knights[1], 'knight', color);
        this.placePiece(piecePositions.bishops[0], 'bishop', color);
        this.placePiece(piecePositions.bishops[1], 'bishop', color);
        this.placePiece(piecePositions.queen, 'queen', color);
        this.placePiece(piecePositions.king, 'king', color);

        // Place additional pieces if they exist
        if (piecePositions.rook2) this.placePiece(piecePositions.rook2, 'rook', color);
        if (piecePositions.knight2) this.placePiece(piecePositions.knight2, 'knight', color);
        if (piecePositions.bishop2) this.placePiece(piecePositions.bishop2, 'bishop', color);
    }

    placePiece(spiralIndex, pieceType, color) {
        const hex = this.hexGrid.getHexBySpiralIndex(spiralIndex);
        if (!hex) {
            console.warn(`Could not find hex at spiral index ${spiralIndex}`);
            return;
        }

        const textureKey = `${color}_${pieceType}`;
        const piece = this.scene.add.image(hex.hexData.screenPos.x, hex.hexData.screenPos.y, textureKey);
        piece.setDepth(10); // Ensure pieces are above hexagons

        // Store piece data
        const pieceData = {
            type: pieceType,
            color: color,
            spiralIndex: spiralIndex,
            sprite: piece,
            hex: hex
        };

        this.pieces.set(spiralIndex, pieceData);
        hex.hexData.piece = pieceData;

        // Make piece interactive
        piece.setInteractive();
        piece.on('pointerdown', () => {
            console.log(`${color} ${pieceType} clicked at index ${spiralIndex}`);
            this.selectPiece(pieceData);
        });
    }

    selectPiece(pieceData) {
        // Clear previous selection
        if (this.selectedPiece) {
            this.selectedPiece.sprite.clearTint();
        }

        // Select new piece
        this.selectedPiece = pieceData;
        pieceData.sprite.setTint(0x00ff00);
        
        // Also select the hex
        this.hexGrid.selectHex(pieceData.hex);
    }

    clearAllPieces() {
        this.pieces.forEach(piece => {
            piece.sprite.destroy();
            piece.hex.hexData.piece = null;
        });
        this.pieces.clear();
        this.selectedPiece = null;
    }

    getPieceAt(spiralIndex) {
        return this.pieces.get(spiralIndex);
    }

    // Toggle piece visibility
    togglePieces() {
        this.piecesVisible = !this.piecesVisible;
        this.pieces.forEach(piece => {
            piece.sprite.setVisible(this.piecesVisible);
        });
        console.log(`Pieces ${this.piecesVisible ? 'shown' : 'hidden'}`);
    }

    // Show/hide pieces
    showPieces() {
        this.piecesVisible = true;
        this.pieces.forEach(piece => {
            piece.sprite.setVisible(true);
        });
    }

    hidePieces() {
        this.piecesVisible = false;
        this.pieces.forEach(piece => {
            piece.sprite.setVisible(false);
        });
    }
}
