export default function() {
    this.addFilter('OutlineFilter', {
        enabled: true,
        fishOnly: true,
        args: [4, 0xEE0000, 0.25, false],
        oncreate(folder) {
            this.padding = this.thickness + 4;
            folder.add(this, 'thickness', 0, 10).onChange((value) => {
                this.padding = value + 4;
            });
            folder.addColor(this, 'color');

            folder.add(this, 'outlineOnly').name('Outline Only');
        }
    });
}
