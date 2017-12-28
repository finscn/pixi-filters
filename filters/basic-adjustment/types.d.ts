/// <reference types="pixi.js" />
declare namespace PIXI.filters {
    class BasicAdjustmentFilter extends PIXI.Filter<{}> {
        constructor(options?: BasicAdjustmentOptions);
        gamma: number;
        contrast: number;
        saturation: number;
        brightness: number;
    }
    interface BasicAdjustmentOptions {
        gamma?: number;
        contrast?: number;
        saturation?: number;
        brightness?: number;
    }
}

declare module "@pixi/filter-basic-adjustment" {
    export = PIXI.filters;
}
