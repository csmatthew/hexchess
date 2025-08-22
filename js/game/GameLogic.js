export class GameLogic {
    constructor(scene) {
        this.scene = scene;
        this.hexGrid = null;
        this.chessPieces = null;
        this.selectedHex = null;
    }

    initialize(hexGrid, chessPieces) {
        this.hexGrid = hexGrid;
        this.chessPieces = chessPieces;
    }

    handleHexSelection(hexSprite) {
        const spiralIndex = hexSprite.hexData.spiralIndex;
        const cubeCoords = hexSprite.hexData.cube;
        const piece = hexSprite.hexData.piece;

        // Check if the hex has a pawn piece
        if (piece && piece.type === 'pawn') {
            console.log(`Pawn selected at coordinates: Spiral Index: ${spiralIndex}, Cube: (${cubeCoords.q}, ${cubeCoords.r}, ${cubeCoords.s})`);
            console.log(`Pawn color: ${piece.color}`);
        }

        // Update selection
        this.selectedHex = hexSprite;
    }
}