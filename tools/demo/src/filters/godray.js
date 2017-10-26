export default function() {
    const app = this;

    this.addFilter('GodrayFilter', {
        enabled: false,
        opened: false,
        oncreate: function(folder) {
            const filter = this;

            this.angle = 30;
            this.gain = 0.7;
            this.lacunarity = 3;

            app.events.on('animate', function(delta){
                filter.time += delta / 1000.0 * 0.5;
            });

            folder.add(this, 'time', 0, 1);
            folder.add(this, 'angle', -60, 60);
            folder.add(this, 'gain', 0, 1);
            folder.add(this, 'lacunarity', 0, 5);
        }
    });
}
