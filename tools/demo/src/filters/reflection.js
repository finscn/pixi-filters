export default function() {
    const app = this;
    app.addFilter('ReflectionFilter', {
        enabled: true,
        global: false,
        opened: false,
        args: [],
        oncreate(folder) {
            const filter = this;

            filter.animating = true;

            app.events.on('enable', function(enabled) {
                if (enabled && filter.animating) {
                    filter.time = 0;
                }
            });

            app.events.on('animate', function() {
                if (filter.animating) {
                    filter.seed = Math.random();
                    filter.time += 0.1;
                }
            });

            folder.add(this, 'animating').name('(animating)');


            folder.add(this, 'boundary', 0, 1);
            folder.add(this.offset, '0', 0, 50).name('offset.start');
            folder.add(this.offset, '1', 0, 50).name('offset.end');
            folder.add(this.density, '0', 0, 1).name('density.start');
            folder.add(this.density, '1', 0, 1).name('density.end');
            folder.add(this.alpha, '0', 0, 1).name('alpha.start');
            folder.add(this.alpha, '1', 0, 1).name('alpha.end');
            folder.add(this, 'seed', 0, 1);
            folder.add(this, 'time', 0, 20);
        }
    });
}
