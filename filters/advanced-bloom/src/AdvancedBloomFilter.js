import ExtractBrightnessFilter from './ExtractBrightnessFilter';
import {vertex} from '@tools/fragments';
import fragment from './advanced-bloom.frag';

/**
 * The AdvancedBloomFilter applies a Bloom Effect to an object. Unlike the normal BloomFilter
 * this had some advanced controls for adjusting the look of the bloom. Note: this filter
 * is slower than normal BloomFilter.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/advanced-bloom.png)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 *
 * @param {object|number} [options] - The optional parameters of advanced bloom filter.
 *                        When options is a number , it will be `options.threshold`.
 * @param {number} [options.threshold=0.5] - Defines how bright a color needs to be to affect bloom.
 * @param {number} [options.bloomScale=1.0] - To adjust the strength of the bloom. Higher values is more intense brightness.
 * @param {number} [options.brightness=1.0] - The brightness, lower value is more subtle brightness, higher value is blown-out.
 * @param {number} [options.blur=8] - Sets the strength of both the blurX and blurY properties simultaneously
 * @param {number} [options.quality=4] - The quality of the blurX & blurY filter.
 * @param {number} [options.kernelSize=5] - The kernelSize of the blurX & blurY filter.Options: 5, 7, 9, 11, 13, 15.
 * @param {number} [options.kawase=null] - The options of the Kawase Blur filter.
 * @param {number} [options.resolution=PIXI.settings.RESOLUTION] - The resolution of the blurX & blurY filter.
 */
export default class AdvancedBloomFilter extends PIXI.Filter {

    constructor(options) {

        super(vertex, fragment);

        if (typeof options === 'number') {
            options = { threshold: options };
        }

        options = Object.assign({
            threshold: 0.5,
            bloomScale: 1.0,
            brightness: 1.0,
            blur: 8,
            quality: 4,
            kernelSize: 5,
            kawase: null,
            resolution: PIXI.settings.RESOLUTION,
        }, options);

        /**
         * To adjust the strength of the bloom. Higher values is more intense brightness.
         *
         * @member {number}
         * @default 1.0
         */
        this.bloomScale = options.bloomScale;

        /**
         * The brightness, lower value is more subtle brightness, higher value is blown-out.
         *
         * @member {number}
         * @default 1.0
         */
        this.brightness = options.brightness;

        const { kawase, blur, quality, kernelSize, resolution } = options;
        const { KawaseBlurFilter, BlurXFilter, BlurYFilter } = PIXI.filters;

        this._kawase = kawase;
        this._blur = blur;
        this._resolution = resolution;

        this._extract = new ExtractBrightnessFilter(options.threshold);
        this._extract.resolution = resolution;

        if (KawaseBlurFilter && kawase) {
            this._kawaseBlur = new KawaseBlurFilter(kawase.kernels, kawase.pixelSize);
            this._kawaseBlur.resolution = resolution;
        }

        this._blurXFilter = new BlurXFilter(blur, quality, resolution, kernelSize);
        this._blurYFilter = new BlurYFilter(blur, quality, resolution, kernelSize);
    }

    /**
     * Override existing apply method in PIXI.Filter
     * @private
     */
    apply(filterManager, input, output, clear, currentState) {

        const brightTarget = filterManager.getRenderTarget(true);
        let bloomTarget;

        this._extract.apply(filterManager, input, brightTarget, true, currentState);

        if (this._kawase && this._kawaseBlur) {
            bloomTarget = filterManager.getRenderTarget(true);
            this._kawaseBlur.apply(filterManager, brightTarget, bloomTarget, true, currentState);
        }
        else {
            this._blurXFilter.apply(filterManager, brightTarget, brightTarget, true, currentState);
            this._blurYFilter.apply(filterManager, brightTarget, brightTarget, true, currentState);
            bloomTarget = brightTarget;
        }

        this.uniforms.bloomScale = this.bloomScale;
        this.uniforms.brightness = this.brightness;
        this.uniforms.bloomTexture = bloomTarget;

        filterManager.applyFilter(this, input, output, clear);

        if (bloomTarget !== brightTarget) {
            filterManager.returnRenderTarget(bloomTarget);
        }
        filterManager.returnRenderTarget(brightTarget);
    }

    /**
     * The resolution of the filter.
     *
     * @member {number}
     */
    get resolution() {
        return this._resolution;
    }
    set resolution(value) {
        this._resolution = value;

        if (this._kawase && this._kawaseBlur) {
            this._kawaseBlur.resolution = value;
        }

        if (this._blurXFilter && this._blurYFilter) {
            this._blurXFilter.resolution = this._blurYFilter.resolution = value;
        }
    }

    /**
     * Defines how bright a color needs to be to affect bloom.
     *
     * @member {number}
     * @default 0.5
     */
    get threshold() {
        return this._extract.threshold;
    }
    set threshold(value) {
        this._extract.threshold = value;
    }

    /**
     * Sets the strength of both the blurX and blurY properties simultaneously
     *
     * @member {number}
     * @default 2
     */
    get blur() {
        return this._blur;
    }
    set blur(value) {
        this._blur = value;
        this._blurXFilter.blur = this._blurYFilter.blur = value;
    }

    /**
     * Sets the options of the Kawase Blur filter
     *
     * @member {object}
     * @default null
     */
    get kawase() {
        return this._kawase;
    }
    set kawase(value) {
        this._kawase = value;

        if (!value || !PIXI.filters.KawaseBlurFilter) {
            return;
        }

        if (!this._kawaseBlur) {
            this._kawaseBlur = new PIXI.filters.KawaseBlurFilter(value.kernels, value.pixelSize);
            this._kawaseBlur.resolution = this._resolution;
        }
        else {
            this._kawaseBlur.kernels = value.kernels;
            this._kawaseBlur.pixelSize = value.pixelSize;
        }
    }
}

// Export to PixiJS namespace
PIXI.filters.AdvancedBloomFilter = AdvancedBloomFilter;
