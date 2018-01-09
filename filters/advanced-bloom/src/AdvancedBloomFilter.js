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
 * @param {boolean} [options.kawase=false] - whether use the Kawase Blur filter.
 * @param {number|number[]|PIXI.Point} [options.pixelSize=1] - the pixelSize of the Kawase Blur filter.
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
            kawase: false,
            pixelSize: 1,
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

        const { kawase, pixelSize, blur, quality, kernelSize, resolution } = options;

        this._pixelSize = pixelSize;
        this._blur = blur;
        this._quality = quality;
        this._kernelSize = kernelSize;
        this._resolution = resolution;

        this._extract = new ExtractBrightnessFilter(options.threshold);
        this._extract.resolution = resolution;

        this.kawase = kawase;
    }

    /**
     * Override existing apply method in PIXI.Filter
     * @private
     */
    apply(filterManager, input, output, clear, currentState) {

        const brightTarget = filterManager.getRenderTarget(true);
        let bloomTarget;

        this._extract.apply(filterManager, input, brightTarget, true, currentState);

        if (this._kawase) {
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
        else if (!this._kawase && this._blurXFilter) {
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
        if (this._kawase && this._kawaseBlur) {
            this._kawaseBlur.blur = value;
        }
        else if (!this._kawase && this._blurXFilter) {
            this._blurXFilter.blur = this._blurYFilter.blur = value;
        }
    }

    /**
     * Sets the quality of the Blur Filter
     *
     * @member {number}
     * @default 4
     */
    get quality() {
        return this._quality;
    }
    set quality(value) {
        this._quality = Math.round(value);
        if (this._kawase && this._kawaseBlur) {
            this._kawaseBlur.quality = value;
        }
        else if (!this._kawase && this._blurXFilter) {
            this._blurXFilter.quality = this._blurYFilter.quality = value;
        }
    }

    /**
     * Whether use KawaseBlurFilter
     *
     * @member {boolean}
     * @default true
     */
    get kawase() {
        return this._kawase;
    }
    set kawase(value) {
        this._kawase = value;

        const { KawaseBlurFilter, BlurXFilter, BlurYFilter } = PIXI.filters;

        if (value) {
            if (!this._kawaseBlur) {
                this._kawaseBlur = new KawaseBlurFilter(this._blur, this._quality);
            }
            else {
                this._kawaseBlur.blur = this._blur;
                this._kawaseBlur.quality = this._quality;
            }
            this._kawaseBlur.resolution = this._resolution;
            this._kawaseBlur.pixelSize = this._pixelSize;
        }
        else {
            if (!this._blurXFilter) {
                this._blurXFilter = new BlurXFilter(this._blur, this._quality, this._resolution, this._kernelSize);
                this._blurYFilter = new BlurYFilter(this._blur, this._quality, this._resolution, this._kernelSize);
            }
            else {
                this._blurXFilter.blur = this._blurYFilter.blur = this._blur;
                this._blurXFilter.quality = this._blurYFilter.quality = this._quality;
                this._blurXFilter.resolution = this._blurYFilter.resolution = this._resolution;
            }
        }
    }

    /**
     * Sets the pixelSize of the Kawase Blur filter
     *
     * @member {number|number[]|PIXI.Point}
     * @default 1
     */
    get pixelSize() {
        return this._pixelSize;
    }
    set pixelSize(value) {
        this._pixelSize = value;

        if (this._kawase && this._kawaseBlur) {
            this._kawaseBlur.pixelSize = value;
        }
    }
}

// Export to PixiJS namespace
PIXI.filters.AdvancedBloomFilter = AdvancedBloomFilter;
