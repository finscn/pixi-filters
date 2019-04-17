/// <reference types="pixi.js" />
declare namespace PIXI.filters {
    class OutlineFilter extends PIXI.Filter<{}> {
        constructor(thickness?:number, color?:number, quality?:number, outlineOnly?:boolean);
        color:number;
        thickness:number;
        readonly quality:number;
        outlineOnly:boolean;
    }
}

declare module "@pixi/filter-outline" {
    export = PIXI.filters;
}
