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

}