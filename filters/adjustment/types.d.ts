/// <reference types="pixi.js" />
declare namespace PIXI.filters {
    class AdjustmentFilter extends PIXI.Filter<{}> {
        constructor(options?: AdjustmentOptions);
        gamma: number;
        contrast: number;
        saturation: number;
        brightness: number;
    }
    interface AdjustmentOptions {
        gamma?: number;
        contrast?: number;
        saturation?: number;
        brightness?: number;
    }
}

declare module "@pixi/filter-adjustment" {
    export = PIXI.filters;
}
