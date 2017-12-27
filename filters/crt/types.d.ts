/// <reference types="pixi.js" />
declare namespace PIXI.filters {
    class CRTFilter extends PIXI.Filter<{}> {
        constructor(options?: CRTOptions);
        sepia: number;
        noise: number;
        noiseSize: number;
        scratch: number;
        scratchDensity: number;
        scratchWidth: number;
        vignetting: number;
        vignettingAlpha: number;
        vignettingBlur: number;
        seed: number;
    }
    interface CRTOptions {
        sepia?: number;
        noise?: number;
        noiseSize?: number;
        scratch?: number;
        scratchDensity?: number;
        scratchWidth?: number;
        vignetting?: number;
        vignettingAlpha?: number;
        vignettingBlur?: number;
    }
}

declare module "@pixi/filter-crt" {
    export = PIXI.filters;
}
