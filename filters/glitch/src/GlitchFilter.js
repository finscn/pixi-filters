import {vertex} from '@tools/fragments';
import fragment from './glitch.frag';

/**
 * The GlitchFilter applies a glitch effect to an object.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/glitch.png)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @param {object} options - The optional parameters of the filter.
 */
export default class GlitchFilter extends PIXI.Filter {
    constructor(slices = 3, offset = 100, direction = 0, options = {}) {

        super(vertex, fragment);

        Object.assign(this, {
            average: false,
            red: [0, 0],
            green: [2, 0],
            blue: [-2, 0],
            fillMode: 0,
            seed: 0.5,
            displaceMap: null,
            displaceMapSize: 512,
        }, options);

        this.offset = offset;
        this.direction = direction;

        if (!this.displaceMap) {
            this.displaceMapCanvas = document.createElement('canvas');
            this.displaceMapCanvas.width = 8;
            this.displaceMapCanvas.height = this.displaceMapSize;
            this.displaceMap = PIXI.Texture.fromCanvas(this.displaceMapCanvas, PIXI.SCALE_MODES.NEAREST);

            this._slices = 0;
            this.slices = slices;
        }
    }

    /**
     * Override existing apply method in PIXI.Filter
     * @private
     */
    apply(filterManager, input, output, clear) {

        this.uniforms.dimensions[0] = input.sourceFrame.width;
        this.uniforms.dimensions[1] = input.sourceFrame.height;

        this.uniforms.seed = this.seed;
        this.uniforms.offset = this.offset;
        this.uniforms.fillMode = this.fillMode;

        filterManager.applyFilter(this, input, output, clear);
    }

    initSlicesWidth(average) {
        this.average = average === undefined ? this.average : (average || false);

        const arr = this.slicesWidth;
        const last = this._slices - 1;

        if (this.average) {
            const count = this._slices;
            let rest = 1;

            for (let i = 0; i < last; i++) {
                const average = rest / (count - i);
                const v = average * (1 - Math.random() * 0.6);
                arr[i] = v;
                rest -= v;
            }
            arr[last] = rest;
        }
        else {
            let rest = 1;
            const ratio = Math.sqrt(1 / this._slices);

            for (let i = 0; i < last; i++) {
                const v = ratio * rest * Math.random();
                arr[i] = v;
                rest -= v;
            }
            arr[last] = rest;
        }

        this.shuffle();
    }

    initSlicesOffset() {
        for (let i = 0 ; i < this._slices; i++) {
            this.slicesOffset[i] = Math.random() * 255 >> 0;
        }
    }

    shuffle() {
        const arr = this.slicesWidth;

        for (let i = this._slices - 1; i > 0; i--) {
            const rand = (Math.random() * i) >> 0;
            const temp = arr[i];

            arr[i] = arr[rand];
            arr[rand] = temp;
        }
    }

    refresh() {
        this.slicesWidth = new Float32Array(this._slices);
        this.initSlicesWidth(this.average);
        this.uniforms.slicesWidth = this.slicesWidth;

        this.slicesOffset = new Float32Array(this._slices);
        this.initSlicesOffset();
        this.uniforms.slicesOffset = this.slicesOffset;

        this.updateDisplaceMap();
    }

    updateDisplaceMap() {
        let canvas = this.displaceMapCanvas;
        let size = this.displaceMapSize;

        let ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, 8, size);

        let offset;
        let y = 0;
        for (let i = 0 ; i < this._slices; i++) {
            offset = this.slicesOffset[i];
            const height = this.slicesWidth[i] * size;
            ctx.fillStyle = 'rgba(' + offset + ', 0, 0, 1)';
            ctx.fillRect(0, y >> 0, size, height + 1 >> 0);
            y += height;
        }

        this.displaceMap._updateID++;
        this.displaceMap.baseTexture.emit('update', this.displaceMap.baseTexture);
        // this.displaceMap.update();
        this.uniforms.displaceMap = this.displaceMap;
    }

    setSlicesWidth(slicesWidth) {
        const len = Math.min(this._slices, slicesWidth.length);

        for (let i = 0; i < len; i++){
            this.slicesWidth[i] = slicesWidth[i];
        }
    }

    setSlicesOffset(slicesOffset) {
        const len = Math.min(this._slices, slicesOffset.length);

        for (let i = 0; i < len; i++){
            this.slicesOffset[i] = slicesOffset[i];
        }
    }

    get slices() {
        return this._slices;
    }
    set slices(value) {
        if (this._slices === value) {
            return;
        }
        this._slices = value;
        this.uniforms.slices = value;

        this.refresh();
    }

    get direction() {
        return this._direction;
    }
    set direction(value) {
        if (this._direction === value) {
            return;
        }
        this._direction = value;
        this.uniforms.sinDir = Math.sin(value);
        this.uniforms.cosDir = Math.cos(value);
    }

    /**
     * Red channel offset.
     *
     * @member {PIXI.Point}
     */
    get red() {
        return this.uniforms.red;
    }
    set red(value) {
        this.uniforms.red = value;
    }

    /**
     * Green channel offset.
     *
     * @member {PIXI.Point}
     */
    get green() {
        return this.uniforms.green;
    }
    set green(value) {
        this.uniforms.green = value;
    }

    /**
     * Blue offset.
     *
     * @member {PIXI.Point}
     */
    get blue() {
        return this.uniforms.blue;
    }
    set blue(value) {
        this.uniforms.blue = value;
    }
}

// Export to PixiJS namespace
PIXI.filters.GlitchFilter = GlitchFilter;
