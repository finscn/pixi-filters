export default function() {
    const app = this;
    app.addFilter('GlitchFilter', {
        enabled: true,
        global: false,
        opened: false,
        args: [{
            rowCount: 32,
            maxOffset: app.initWidth / 4 >> 0,
        }, 0],
        oncreate(folder) {
            window.glitchFilter = this;

            // app.events.on('animate', function() {
            //     filter.seed = Math.random();
            // });

            folder.add(this, 'seed', 0, 1);
            folder.add(this, 'maxOffset', 0, app.initWidth / 2 >> 0);
        }
    });
}
