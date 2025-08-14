export class ColorUtils {
    static cssColorToHex(cssColor) {
        // Convert CSS color (like "#F0D9B5") to Phaser hex (like 0xF0D9B5)
        const hex = cssColor.trim().replace('#', '');
        return parseInt(hex, 16);
    }

    static getCSSThemes() {
        // Get computed CSS custom properties
        const root = document.documentElement;
        const computedStyle = getComputedStyle(root);
        
        return {
            classic: {
                name: "Classic Chess",
                light: this.cssColorToHex(computedStyle.getPropertyValue('--classic-light')),
                dark: this.cssColorToHex(computedStyle.getPropertyValue('--classic-dark')),
                stroke: this.cssColorToHex(computedStyle.getPropertyValue('--classic-stroke'))
            },
            forest: {
                name: "Forest",
                light: this.cssColorToHex(computedStyle.getPropertyValue('--forest-light')),
                dark: this.cssColorToHex(computedStyle.getPropertyValue('--forest-dark')),
                stroke: this.cssColorToHex(computedStyle.getPropertyValue('--forest-stroke'))
            },
            ocean: {
                name: "Ocean",
                light: this.cssColorToHex(computedStyle.getPropertyValue('--ocean-light')),
                dark: this.cssColorToHex(computedStyle.getPropertyValue('--ocean-dark')),
                stroke: this.cssColorToHex(computedStyle.getPropertyValue('--ocean-stroke'))
            },
            sunset: {
                name: "Sunset",
                light: this.cssColorToHex(computedStyle.getPropertyValue('--sunset-light')),
                dark: this.cssColorToHex(computedStyle.getPropertyValue('--sunset-dark')),
                stroke: this.cssColorToHex(computedStyle.getPropertyValue('--sunset-stroke'))
            },
            royal: {
                name: "Royal",
                light: this.cssColorToHex(computedStyle.getPropertyValue('--royal-light')),
                dark: this.cssColorToHex(computedStyle.getPropertyValue('--royal-dark')),
                stroke: this.cssColorToHex(computedStyle.getPropertyValue('--royal-stroke'))
            },
            monochrome: {
                name: "Monochrome",
                light: this.cssColorToHex(computedStyle.getPropertyValue('--mono-light')),
                dark: this.cssColorToHex(computedStyle.getPropertyValue('--mono-dark')),
                stroke: this.cssColorToHex(computedStyle.getPropertyValue('--mono-stroke'))
            }
        };
    }
}