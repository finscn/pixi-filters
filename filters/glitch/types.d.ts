/// <reference types="pixi.js" />
declare namespace PIXI.filters {
    class GlitchFilter extends PIXI.Filter<{}> {
        constructor(bandCount?:number, offset?:number, options?:GlitchOptions);
        bandCount:number,
        offset:number,
        seed:number,
        red:PIXI.Point,
        green:PIXI.Point,
        blue:PIXI.Point,
    }
    interface GlitchOptions {
        maxBandCount:number,
        bandCount:number,
        average:boolean,
        offset:number,
        seed:number,
        red:PIXI.Point,
        green:PIXI.Point,
        blue:PIXI.Point,
        vertical:boolean
    }
}

declare module "@pixi/filter-glitch" {
    export = PIXI.filters;
}
