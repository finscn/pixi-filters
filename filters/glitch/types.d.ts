/// <reference types="pixi.js" />
declare namespace PIXI.filters {
    class GlitchFilter extends PIXI.Filter<{}> {
        constructor(options?:GlitchOptions);
        offset:number,
        seed:number,
        red:PIXI.Point,
        green:PIXI.Point,
        blue:PIXI.Point,
    }
    interface GlitchOptions {
        bandsWidth:Array<number>,
        bandsOffset:Array<number>,
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
