import {vertex} from '@tools/fragments';
import fragment from './kawase-blur.frag';

export default class KawaseBlurFilter extends PIXI.Filter {
    constructor(kernels = [0], pixelSize = [1.0, 1.0]) {
        super(
            vertex,
            fragment
        );

        this._passes = 0;
        this._kernels = null;
        this.kernels = kernels;

        this._pixelSize = new PIXI.Point(0,0);
        this.pixelSize = pixelSize;
    }

    apply(filterManager, input, output, clear) {
        // pixelSize / filterArea_Size
        this.uniforms.uPixelSize[0] = this.pixelSize.x / input.size.width;
        this.uniforms.uPixelSize[1] = this.pixelSize.y / input.size.height;

        if (this._passes === 1) {
            this.uniforms.uOffset = this._kernels[0];
            filterManager.applyFilter(this, input, output, clear);
        }
        else {
            const renderTarget = filterManager.getRenderTarget(true);

            let source = input;
            let target = renderTarget;
            let tmp;

            const last = this._passes - 1;

            for (let i = 0; i < last; i++) {
                this.uniforms.uOffset = this._kernels[i];
                filterManager.applyFilter(this, source, target, true);

                tmp = source;
                source = target;
                target = tmp;
            }
            this.uniforms.uOffset = this._kernels[last];
            filterManager.applyFilter(this, source, output, clear);

            filterManager.returnRenderTarget(renderTarget);
        }
    }

    get kernels() { // eslint-disable-line require-jsdoc
        return this._kernels;
    }

    set kernels(value) { // eslint-disable-line require-jsdoc
        this._kernels = value;
        this._passes = value.length;
    }

    /**
     * Sets the pixelSize of the filter.
     *
     * @member {PIXI.Point|number[]}
     * @default [0, 0]
     */
    set pixelSize(value) {
        if (typeof value === 'number') {
            this._pixelSize.x = value;
            this._pixelSize.y = value;
        }
        else if (Array.isArray(value)) {
            this._pixelSize.x = value[0];
            this._pixelSize.y = value[1];
        }
        else if (value instanceof PIXI.Point) {
            this._pixelSize.x = value.x;
            this._pixelSize.y = value.y;
        }
    }

    get pixelSize() {
        return this._pixelSize;
    }
}

// Export to PixiJS namespace
PIXI.filters.KawaseBlurFilter = KawaseBlurFilter;
