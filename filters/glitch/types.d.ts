/// <reference types="pixi.js" />
declare namespace PIXI.filters {
    class GlitchFilter extends PIXI.Filter<{}> {
        constructor(options?:GlitchOptions, seed?:number);
        seed:number;
        maxOffset:number;
    }
    interface GlitchOptions {
        rowCount?: number;
        maxOffset?: number;
        splitRGB?: boolean;
        vertical?: boolean;
    }
}

declare module "@pixi/filter-glitch" {
    export = PIXI.filters;
}
