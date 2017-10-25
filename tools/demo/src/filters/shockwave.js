export default function() {
    const app = this;
    this.addFilter('ShockwaveFilter', {
        enabled: false,
        global: false,
        args: [[app.initWidth / 2, app.initHeight / 2]],
        oncreate(folder) {
            const maxTime = 1200;

            const filter = this;
            const startTime = Date.now();
            let time = 0;
            app.events.on('animate', function() {
                time = (Date.now() - startTime) % maxTime;
                filter.time = time;
            });

            // folder.add(this, 'time', 0, maxTime);
            folder.add(this, 'amplitude', 1, 100);
            folder.add(this, 'wavelength', 2, 400);
            folder.add(this, 'brightness', 0.2, 2.0);
            folder.add(this, 'radius', 100, 2000);
            folder.add(this.center, '0', 0, app.initWidth).name('center.x');
            folder.add(this.center, '1', 0, app.initHeight).name('center.y');
        }
    });
}
