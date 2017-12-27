import {vertex} from '@tools/fragments';
import fragment from './crt.frag';

/**
 * The CRTFilter applies a CRT effect to an object.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/crt.gif)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 *
 * @param {object|number} [options] - The optional parameters of old film effect.
 *                        When options is a number , it will be `seed`
 * @param {number} [options.sepia=0.3] - The amount of saturation of sepia effect,
 *        a value of `1` is more saturation and closer to `0` is less, and a value of
 *        `0` produces no sepia effect
 * @param {number} [options.noise=0.3] - Opacity/intensity of the noise effect between `0` and `1`
 * @param {number} [options.noiseSize=1.0] - The size of the noise particles
 * @param {number} [options.scratch=0.5] - How often scratches appear
 * @param {number} [options.scratchDensity=0.3] - The density of the number of scratches
 * @param {number} [options.scratchWidth=1.0] - The width of the scratches
 * @param {number} [options.vignetting=0.3] - The radius of the vignette effect, smaller
 *        values produces a smaller vignette
 * @param {number} [options.vignettingAlpha=1.0] - Amount of opacity of vignette
 * @param {number} [options.vignettingBlur=0.3] - Blur intensity of the vignette
 * @param {number} [seed=0] - A see value to apply to the random noise generation
 */
export default class CRTFilter extends PIXI.Filter {
    constructor(options) {
        super(vertex, fragment);

        Object.assign(this, {
            seed: 0.0,
            time: 0.0,
        }, options);
    }

    /**
     * Override existing apply method in PIXI.Filter
     * @private
     */
    apply(filterManager, input, output, clear) {
        this.uniforms.dimensions[0] = input.sourceFrame.width;
        this.uniforms.dimensions[1] = input.sourceFrame.height;

        // this.uniforms.seed = this.seed;
        // this.uniforms.time = this.time;

        filterManager.applyFilter(this, input, output, clear);
    }

}

// Export to PixiJS namespace
PIXI.filters.CRTFilter = CRTFilter;
