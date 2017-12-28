export default function() {
    const app = this;
    app.addFilter('CRTFilter', {
        enabled: true,
        global: false,
        opened: false,
        // args: [[app.initWidth / 2, app.initHeight / 2]],
        oncreate(folder) {
            const filter = this;

            app.events.on('animate', function() {
                filter.seed = Math.random();
            });

            folder.add(this, 'curvature', 0, 1);
            folder.add(this, 'lineWidth', 0, 10);
            folder.add(this, 'lineContrast', 0, 1);
            folder.add(this, 'verticalLine');

            folder.add(this, 'noise', 0, 1);
            folder.add(this, 'noiseSize', 1, 10);
            folder.add(this, 'vignetting', 0, 1);
            folder.add(this, 'vignettingAlpha', 0, 1);
            folder.add(this, 'vignettingBlur', 0, 1);
            folder.add(this, 'seed', 0, 1);
            folder.add(this, 'time', 0, 300);
            // folder.add(this, 'noise', 0, 1);
            // folder.add(this, 'noiseSize', 1, 10);
            // folder.add(this, 'scratch', -1, 1);
            // folder.add(this, 'scratchDensity', 0, 1);
            // folder.add(this, 'scratchWidth', 1, 20);
            // folder.add(this, 'vignetting', 0, 1);
            // folder.add(this, 'vignettingAlpha', 0, 1);
            // folder.add(this, 'vignettingBlur', 0, 1);
        }
    });
}
