import { HexMath } from '../utils/HexMath.js';
import { HexGeometry } from './HexGeometry.js';

export class SpiralIndexing {
    static spiralIndexStartOfRing(radius) {
        return 1 + 3 * radius * (radius - 1);
    }

    static spiralIndexToRadius(index) {
        // solve for 'radius' in equation: index = 1 + 3 * radius * (radius-1)
        return Math.floor((Math.sqrt(12 * index - 3) + 3) / 6);
    }

    static spiralToCube(index) {
        const center = { q: 0, r: 0, s: 0 };
        if (index === 0) return center;
        
        const radius = this.spiralIndexToRadius(index);
        const ringStart = this.spiralIndexStartOfRing(radius);
        const ring = HexGeometry.cubeRing(center, radius);
        return ring[index - ringStart];
    }

    static cubeToSpiral(hex) {
        const center = { q: 0, r: 0, s: 0 };
        
        // Check if it's the center
        if (hex.q === 0 && hex.r === 0 && hex.s === 0) {
            return 0;
        }
        
        const radius = HexMath.cubeDistance(hex, center);
        const ringHexes = HexGeometry.cubeRing(center, radius);
        
        for (let i = 0; i < ringHexes.length; i++) {
            if (hex.q === ringHexes[i].q && hex.r === ringHexes[i].r && hex.s === ringHexes[i].s) {
                return i + this.spiralIndexStartOfRing(radius);
            }
        }
        return -1; // Not found
    }
}