export class HexMath {
    // Hexagonal direction vectors (cube coordinates)
    static cubeDirections = [
        { q: 1, r: -1, s: 0 }, { q: 1, r: 0, s: -1 }, { q: 0, r: 1, s: -1 },
        { q: -1, r: 1, s: 0 }, { q: -1, r: 0, s: 1 }, { q: 0, r: -1, s: 1 }
    ];

    static cubeDistance(a, b) {
        return Math.max(Math.abs(a.q - b.q), Math.abs(a.r - b.r), Math.abs(a.s - b.s));
    }

    static cubeAdd(a, b) {
        return { q: a.q + b.q, r: a.r + b.r, s: a.s + b.s };
    }

    static cubeScale(hex, factor) {
        return { q: hex.q * factor, r: hex.r * factor, s: hex.s * factor };
    }

    static cubeNeighbor(hex, direction) {
        return this.cubeAdd(hex, this.cubeDirections[direction]);
    }

    // Round fractional cube coordinates to nearest hex
    static cubeRound(hex) {
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

    // Convert cube coordinates to pixel coordinates
    static cubeToPixel(hex, size) {
        const x = size * (3/2 * hex.q);
        const y = size * (Math.sqrt(3)/2 * hex.q + Math.sqrt(3) * hex.r);
        return { x, y };
    }

    // Convert pixel coordinates to cube coordinates
    static pixelToCube(point, size) {
        const q = (2/3 * point.x) / size;
        const r = (-1/3 * point.x + Math.sqrt(3)/3 * point.y) / size;
        const s = -q - r;
        return this.cubeRound({ q, r, s });
    }
}