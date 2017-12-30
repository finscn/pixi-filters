varying vec2 vTextureCoord;
uniform sampler2D uSampler;

uniform vec4 filterArea;
uniform vec2 dimensions;

uniform float boundary;
uniform vec2 offset;
uniform vec2 density;
uniform vec2 alpha;
uniform float seed;
uniform float time;

float rand(vec2 co) {
    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

void main(void)
{
    seed;
    time;

    vec2 pixelCoord = vTextureCoord.xy * filterArea.xy;
    vec2 coord = pixelCoord / dimensions;

    if (coord.y < boundary) {
        gl_FragColor = texture2D(uSampler, vTextureCoord);
        return;
    }

    float areaY = boundary * dimensions.y / filterArea.y;
    float y = areaY + areaY - vTextureCoord.y;

    float k = (coord.y - boundary)/(1. - boundary + 0.0001);

    float _offset = (offset.y - offset.x) * k + offset.x;
    float _density = (density.y - density.x) * k + density.x;
    float _alpha = (alpha.y - alpha.x) * k + alpha.x;

    float x = vTextureCoord.x + cos(y * 100. * _density - time) * _offset / filterArea.x;

    vec4 color = texture2D(uSampler, vec2(x, y));

    gl_FragColor = color * _alpha;
}
