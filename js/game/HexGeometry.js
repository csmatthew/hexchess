import { HexMath } from '../utils/HexMath.js';

export class HexGeometry {
    static cubeRing(center, radius) {
        if (radius === 0) {
            return [center];
        }

        const results = [];
        let hex = HexMath.cubeAdd(center, HexMath.cubeScale(HexMath.cubeDirections[4], radius));
        
        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < radius; j++) {
                results.push({...hex});
                hex = HexMath.cubeNeighbor(hex, i);
            }
        }
        return results;
    }

    static cubeSpiral(center, radius) {
        let results = [center];
        for (let k = 1; k <= radius; k++) {
            results = results.concat(this.cubeRing(center, k));
        }
        return results;
    }

    // Generate Gliński's hex chess board (91 hexagons, radius 5)
    static generateGlinskiBoard() {
        const center = { q: 0, r: 0, s: 0 };
        const boardRadius = 5;
        return this.cubeSpiral(center, boardRadius);
    }
}