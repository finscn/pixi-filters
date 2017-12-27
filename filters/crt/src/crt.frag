varying vec2 vTextureCoord;
uniform sampler2D uSampler;

uniform vec4 filterArea;
// uniform vec4 filterClamp;
uniform vec2 dimensions;
// uniform float aspect;

const float curvature = 1.0;
const float lineWidth = 1.0;
const float time = 1.0;

const float vignetting = 1.0;
const float light = 1.0;

// uniform float noise;
// uniform float noiseSize;
// uniform float seed;

float rand(vec2 co) {
    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

void main(void)
{
    gl_FragColor = texture2D(uSampler, vTextureCoord);
    vec3 rgb = gl_FragColor.rgb;

    vec2 pixelCoord = vTextureCoord.xy * filterArea.xy;
    vec2 coord = pixelCoord / dimensions;

    vec2 st = coord - vec2(.5);

    float d = length(st * 0.5 * st * 0.5);
    vec2 uv = curvature > 0. ? st * d + st * 0.935 : st;


    float y = uv.y * lineWidth + time;
    float showScanlines = 1.;
    if (dimensions.y < 360.) {
        // showScanlines = 0.;
    }
    float s = 1. - smoothstep(320., 1440., dimensions.y) + 1.;
    float j = cos(y*dimensions.y*s)*.1; // values between .01 to .25 are ok.
    rgb = abs(showScanlines-1.)*rgb + showScanlines*(rgb - rgb*j);
    rgb *= 1. - ( .01 + ceil(mod( (st.x+.5)*dimensions.x, 3.) ) * (.995-1.01) )*showScanlines;

    // if (noise > 0.0 && noiseSize > 0.0)
    // {
    //     pixelCoord.x = floor(pixelCoord.x / noiseSize);
    //     pixelCoord.y = floor(pixelCoord.y / noiseSize);
    //     float _noise = rand(pixelCoord * noiseSize * seed) - 0.5;
    //     rgb += _noise * noise;
    // }
    //
    // if (vignetting > 0.0)
    // {
        rgb = rgb * (light > 0.0 ? 1. - min(1., d*light) : 1.0);

        float m = max(0.0, 1. - 2.*max(abs(uv.x), abs(uv.y) ) );
        float alpha = min(m*200., 1.);
    // }

    gl_FragColor = vec4(rgb/gl_FragColor.a * alpha, alpha);
}
