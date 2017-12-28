varying vec2 vTextureCoord;
uniform sampler2D uSampler;

uniform vec4 filterArea;
// uniform vec4 filterClamp;
uniform vec2 dimensions;
// uniform float aspect;

const float SQRT_2 = 1.414213;

const float light = 1.0;

uniform float curvature;
uniform float lineWidth;
uniform float noise;
uniform float noiseSize;

uniform float vignetting;
uniform float vignettingAlpha;
uniform float vignettingBlur;

uniform float seed;
uniform float time;

float rand(vec2 co) {
    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

void main(void)
{
    gl_FragColor = texture2D(uSampler, vTextureCoord);
    vec3 rgb = gl_FragColor.rgb;

    vec2 pixelCoord = vTextureCoord.xy * filterArea.xy;
    vec2 coord = pixelCoord / dimensions;

    // vec2 st = coord - vec2(.5);
    vec2 dir = vec2(coord - vec2(0.5, 0.5));

    float d = length(dir * 0.5 * dir * 0.5);
    vec2 uv = curvature > 0. ? dir * (1.0 + curvature * (d + 0.535)): dir;

    float scanlines = 1.;
    float y = uv.y * (1.0 / lineWidth) + time;
    float s = 1. - smoothstep(320., 1440., dimensions.y) + 1.;
    float j = cos(dimensions.y * y * s) * .1; // values between .01 to .25 are ok.
    rgb = abs(scanlines - 1.) * rgb + scanlines * (rgb - rgb * j);
    rgb *= 1. - (.01 + ceil(mod((dir.x + .5) * dimensions.x, 3.)) * (.995 - 1.01)) * scanlines;

    if (noise > 0.0 && noiseSize > 0.0)
    {
        pixelCoord.x = floor(pixelCoord.x / noiseSize);
        pixelCoord.y = floor(pixelCoord.y / noiseSize);
        float _noise = rand(pixelCoord * noiseSize * seed) - 0.5;
        rgb += _noise * noise;
    }

    if (vignetting > 0.0)
    {
        float outter = SQRT_2 - vignetting * SQRT_2;
        // dir.y *= dimensions.y / dimensions.x;
        float darker = clamp((outter - length(dir) * SQRT_2) / ( 0.00001 + vignettingBlur * SQRT_2), 0.0, 1.0);
        rgb *= darker + (1.0 - darker) * (1.0 - vignettingAlpha);
    }

    float m = max(0.0, 1. - 2.*max(abs(uv.x), abs(uv.y)));
    float alpha = min(m * 200., 1.);

    gl_FragColor = vec4(rgb / gl_FragColor.a * alpha, alpha);
}
