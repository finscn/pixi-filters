/// <reference types="pixi.js" />
declare namespace PIXI.filters {
    class OldFilmFilter extends PIXI.Filter {
        constructor(options?: OldFilmOptions, randomValue?: number);
        constructor(randomValue?: number);
        sepia: number;
        noise: number;
        noiseSize: number;
        scratch: number;
        scratchWidth: number;
        vignetting: number;
        vignettingBlur: number;
        randomValue: number;
    }
    interface OldFilmOptions {
        sepia?: number;
        noise?: number;
        noiseSize?: number;
        scratch?: number;
        scratchWidth?: number;
        vignetting?: number;
        vignettingBlur?: number;
    }
}

declare module "@pixi/filter-old-film" {
    export = PIXI.filters;
}
