export default function() {
    const app = this;
    app.addFilter('GlitchFilter', {
        enabled: true,
        global: false,
        opened: false,
        args: [8, app.initWidth / 4 >> 0, {
            maxBandCount: 32,
            average: false,
            red: [2, 2],
            green: [-10, 4],
            blue: [10, -4],
            seed: 0.5,
            loop: true,
        }, 0],
        oncreate(folder) {
            const filter = this;

            window.glitchFilter = filter;

            filter.animating = true;

            app.events.on('animate', function() {
                if (filter.animating) {
                    filter.seed = Math.random();
                }
            });

            folder.add(this, 'animating').name('(animating)');
            folder.add(this, 'seed', 0, 1).name('shake-seed');
            folder.add(this, 'bandCount', 4, 20).onChange(function(value) {
                filter.bandCount = value >> 0;
            });
            folder.add(this, 'offset', 0, app.initWidth / 2 >> 0);
            folder.add(this, 'loop');
            folder.add(this.red, '0', -20, 20).name('red.x');
            folder.add(this.red, '1', -20, 20).name('red.y');
            folder.add(this.blue, '0', -20, 20).name('blue.x');
            folder.add(this.blue, '1', -20, 20).name('blue.y');
            folder.add(this.green, '0', -20, 20).name('green.x');
            folder.add(this.green, '1', -20, 20).name('green.y');
        }
    });
}
