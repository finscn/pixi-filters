import {vertex} from '@tools/fragments';
import fragment from './reflection.frag';

/**
 * The ReflectionFilter applies a reflection effect to an object.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/reflection.gif)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 *
 * @param {object} [options] - The optional parameters of CRT effect.
 * @param {number} [options.curvature=1.0] - TODO
 * @param {number} [options.lineWidth=1.0] - TODO
 * @param {number} [options.lineContrast=0.25] - TODO
 * @param {number} [options.verticalLine=false] - TODO
 * @param {number} [options.noise=0.3] - Opacity/intensity of the noise effect between `0` and `1`
 * @param {number} [options.noiseSize=1.0] - The size of the noise particles
 * @param {number} [seed=0] - A see value to apply to the random noise generation
 * @param {number} [options.vignetting=0.3] - The radius of the vignette effect, smaller
 *        values produces a smaller vignette
 * @param {number} [options.vignettingAlpha=1.0] - Amount of opacity of vignette
 * @param {number} [options.vignettingBlur=0.3] - Blur intensity of the vignette
 * @param {number} [time=0] - TODO
 */
export default class ReflectionFilter extends PIXI.Filter {
    constructor(options) {
        super(vertex, fragment);

        Object.assign(this, {
            boundary: 0.5,
            offset: [0, 30],
            density: [1, 0],
            alpha: [1, 1],
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

        this.uniforms.boundary = this.boundary;
        this.uniforms.offset[0] = this.offset[0];
        this.uniforms.offset[1] = this.offset[1];
        this.uniforms.density[0] = this.density[0];
        this.uniforms.density[1] = this.density[1];
        this.uniforms.alpha[0] = this.alpha[0];
        this.uniforms.alpha[1] = this.alpha[1];
        this.uniforms.seed = this.seed;
        this.uniforms.time = this.time;

        filterManager.applyFilter(this, input, output, clear);
    }
}

// Export to PixiJS namespace
PIXI.filters.ReflectionFilter = ReflectionFilter;
