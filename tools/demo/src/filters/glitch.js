export default function() {
    const app = this;
    app.addFilter('GlitchFilter', {
        enabled: true,
        global: false,
        opened: false,
        args: [8, 200, 0, {
            average: false,
            red: [2, 2],
            green: [-10, 4],
            blue: [10, -4],
            seed: 0.5,
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
            folder.add(this, 'slices', 2, 20).onChange(function(value) {
                filter.slices = value >> 0;
            });
            folder.add(this, 'offset', -400, 400);
            folder.add(this, 'direction', -3.14159, 3.14159);
            folder.add(this, 'fillMode',[0, 1, 2, 3]);
            folder.add(this.red, '0', -50, 50).name('red.x');
            folder.add(this.red, '1', -50, 50).name('red.y');
            folder.add(this.blue, '0', -50, 50).name('blue.x');
            folder.add(this.blue, '1', -50, 50).name('blue.y');
            folder.add(this.green, '0', -50, 50).name('green.x');
            folder.add(this.green, '1', -50, 50).name('green.y');
        }
    });
}
