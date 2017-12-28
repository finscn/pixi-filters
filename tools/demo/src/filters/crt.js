export default function() {
    const app = this;
    app.addFilter('CRTFilter', {
        enabled: true,
        global: false,
        opened: false,
        args: [{
            lineWidth: 3,
            lineContrast: 0.3,
            noise:0.2,
            time:0.5,
        }],
        oncreate(folder) {
            const filter = this;

            app.events.on('animate', function() {
                filter.seed = Math.random();
                filter.time += 0.5;
            });

            folder.add(this, 'curvature', 0, 10);
            folder.add(this, 'lineWidth', 0, 5);
            folder.add(this, 'lineContrast', 0, 1);
            folder.add(this, 'verticalLine');

            folder.add(this, 'noise', 0, 1);
            folder.add(this, 'noiseSize', 1, 10);
            folder.add(this, 'vignetting', 0, 1);
            folder.add(this, 'vignettingAlpha', 0, 1);
            folder.add(this, 'vignettingBlur', 0, 1);
            folder.add(this, 'seed', 0, 1);
            folder.add(this, 'time', 0, 20);
        }
    });
}
