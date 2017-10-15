/// <reference types="pixi.js" />
declare namespace PIXI.filters {
    class AdvancedBloomFilter extends PIXI.Filter {
        constructor(minBright?:number, brightScale?:number, toneScale?:number, blur?:number, quality?:number, resolution?:number, kernelSize?:number);
        minBright:number;
        brightScale:number;
        toneScale:number;
        blur:number;
    }
}

declare module "@pixi/filter-advanced-bloom" {
    export = PIXI.filters;
}