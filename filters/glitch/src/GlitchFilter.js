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
    constructor(options = {}) {

        const rowCount = options.rowCount || 1;

        super(vertex,
            fragment.replace(/%ROW_COUNT%/gi, rowCount)
        );

        Object.assign(this, {
            rowCount: rowCount,
            maxOffset: 100,
            seed: 0,
            splitRGB: false, // TODO
            vertical: false, // TODO
        }, options);

        this.rowsData = new Float32Array(rowCount);
        this.uniforms.rowsData = this.rowsData;

        this.initRowData();
        this.shuffle();
    }

    /**
     * Override existing apply method in PIXI.Filter
     * @private
     */
    apply(filterManager, input, output, clear) {
        this.uniforms.seed = this.seed;
        this.uniforms.maxOffset = this.maxOffset;
        filterManager.applyFilter(this, input, output, clear);
    }

    initRowData() {
        const arr = this.rowsData;
        const last = this.rowCount - 1;

        const ratio = Math.sqrt(1 / this.rowCount);
        let rest = 1;

        for (let i = 0; i < last; i++) {
            const v = ratio * rest * Math.random();
            arr[i] = v * (Math.random() < 0.5 ? -1 : 1);
            rest -= v;
        }
        arr[last] = rest;
    }

    shuffle() {
        const arr = this.rowsData;

        for (let i = this.rowCount - 1; i > 0; i--) {
            const rnd = (Math.random() * i) >> 0;
            const temp = arr[i];

            arr[i] = arr[rnd];
            arr[rnd] = temp;
        }
    }
}

// Export to PixiJS namespace
PIXI.filters.GlitchFilter = GlitchFilter;
