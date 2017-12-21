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
    constructor(bandCount = 3, offset = 100, options = {}) {

        const maxBandCount = Math.max(options.maxBandCount || 0 , bandCount);

        super(vertex,
            fragment.replace(/%MAX_BAND_COUNT%/gi, maxBandCount)
        );

        Object.assign(this, {
            average: false,
            red: [0, 0],
            green: [2, 0],
            blue: [-2, 0],
            loop: false,
            seed: 0.5,
            vertical: false, // TODO
        }, options);

        this.offset = offset;
        this.maxBandCount = maxBandCount;

        this._bandCount = 0;
        this.bandCount = bandCount;
    }

    /**
     * Override existing apply method in PIXI.Filter
     * @private
     */
    apply(filterManager, input, output, clear) {
        const ratioX = input.sourceFrame.width / input.size.width;
        const ratioY = input.sourceFrame.height / input.size.height;

        this.uniforms.ratio[0] = ratioX;
        this.uniforms.ratio[1] = ratioY;

        this.uniforms.seed = this.seed;
        this.uniforms.offset = this.offset;
        this.uniforms.loop = this.loop;
        filterManager.applyFilter(this, input, output, clear);
    }

    initBandsWidth(average) {
        this.average = average === undefined ? this.average : (average || false);

        const arr = this.bandsWidth;
        const last = this._bandCount - 1;

        if (this.average) {
            const count = this._bandCount;
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
            const ratio = Math.sqrt(1 / this._bandCount);

            for (let i = 0; i < last; i++) {
                const v = ratio * rest * Math.random();
                arr[i] = v;
                rest -= v;
            }
            arr[last] = rest;
        }

        this.shuffle();
    }

    initBandsOffset() {
        for (let i = 0 ; i < this._bandCount; i++) {
            this.bandsOffset[i] = Math.random() * (Math.random() < 0.5 ? -1 : 1);
        }
    }

    setBandsWidth(bandsWidth) {
        const len = Math.min(this._bandCount, bandsWidth.length);

        for (let i = 0; i < len; i++){
            this.bandsWidth[i] = bandsWidth[i];
        }
    }

    setBandsOffset(bandsOffset) {
        const len = Math.min(this._bandCount, bandsOffset.length);

        for (let i = 0; i < len; i++){
            this.bandsOffset[i] = bandsOffset[i];
        }
    }

    shuffle() {
        const arr = this.bandsWidth;

        for (let i = this._bandCount - 1; i > 0; i--) {
            const rand = (Math.random() * i) >> 0;
            const temp = arr[i];

            arr[i] = arr[rand];
            arr[rand] = temp;
        }
    }

    get bandCount() {
        return this._bandCount;
    }
    set bandCount(value) {
        if (this._bandCount === value) {
            return;
        }
        this._bandCount = value;
        this.uniforms.bandCount = value;

        this.bandsWidth = new Float32Array(value);
        this.initBandsWidth(this.average);
        this.uniforms.bandsWidth = this.bandsWidth;

        this.bandsOffset = new Float32Array(value);
        this.initBandsOffset();
        this.uniforms.bandsOffset = this.bandsOffset;
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
