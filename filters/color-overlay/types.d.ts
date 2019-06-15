/// <reference types="pixi.js" />
declare namespace PIXI.filters {
    class ColorOverlayFilter extends PIXI.Filter<{}> {
        constructor(color?:number|[number, number, number]);
        color:number|[number, number, number];
    }
}

declare module "@pixi/filter-color-overlay" {
    export = PIXI.filters;
}
