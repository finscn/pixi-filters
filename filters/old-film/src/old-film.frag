varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform vec4 filterArea;
uniform vec2 dimensions;

uniform float sepia;
uniform float noise;
uniform float scratch;
uniform float scratchWidth;
uniform float vignetting;
uniform float vignettingBlur;
uniform float randomValue;

const float SQRT_2 = 1.414213;
const vec3 SEPIA_RGB = vec3(112.0 / 255.0, 66.0 / 255.0, 20.0 / 255.0);

${noise2D}

vec3 Overlay(vec3 src, vec3 dst)
{
    // if (dst <= 0.5) then: 2 * src * dst
    // if (dst > 0.5) then: 1 - 2 * (1 - dst) * (1 - src)
    return vec3((dst.x <= 0.5) ? (2.0 * src.x * dst.x) : (1.0 - 2.0 * (1.0 - dst.x) * (1.0 - src.x)),
                (dst.y <= 0.5) ? (2.0 * src.y * dst.y) : (1.0 - 2.0 * (1.0 - dst.y) * (1.0 - src.y)),
                (dst.z <= 0.5) ? (2.0 * src.z * dst.z) : (1.0 - 2.0 * (1.0 - dst.z) * (1.0 - src.z)));
}


void main()
{
    gl_FragColor = texture2D(uSampler, vTextureCoord);
    vec3 color = gl_FragColor.rgb;

    if (sepia > 0.0)
    {
        float gray = (color.x + color.y + color.z) / 3.0;
        vec3 grayscale = vec3(gray);

        color = Overlay(SEPIA_RGB, grayscale);

        color = grayscale + sepia * (color - grayscale);
    }

    if (noise > 0.0)
    {
        float _noise = snoise(vTextureCoord * vec2(1024.0 + randomValue * 512.0, 1024.0 + randomValue * 512.0)) * 0.5;
        color += _noise * noise;
    }

    vec2 coord = vTextureCoord * filterArea.xy / dimensions.xy;

    if (scratch > randomValue)
    {
        float phase = randomValue * 256.0;

        float dist = 1.0 / scratch;
        float s = mod(floor(phase), 2.0);
        float d = distance(coord, vec2(randomValue * dist, abs(s - randomValue * dist)));
        if (d < randomValue * 0.4 + 0.4)
        {
            float period = scratch * 10.0;

            float xx = coord.x * period + phase;
            float aa = abs(mod(xx, 0.5) * 4.0);
            float bb = mod(floor(xx / 0.5), 2.0);
            float yy = 2.0 - (1.0 - bb) * aa - bb * (2.0 - aa);

            float kk = 2.0 * period;
            float dw = ceil(scratchWidth * (0.75 + randomValue)) / dimensions.x;
            float dh = dw * kk;
            float vScratch = yy - dh;

            if (vScratch < 0.0){
                vScratch = vScratch / period - 0.60;
            }
            vScratch = clamp(vScratch + 1.0, 0.0, 1.0);
            color.rgb *= vScratch;
        }
    }

    if (vignetting > 0.0)
    {
        float outter = SQRT_2 - vignetting * SQRT_2;
        vec2 dir = vec2(vec2(0.5, 0.5) - coord);
        dir.y *= dimensions.y / dimensions.x;
        float darker = clamp((outter - length(dir) * SQRT_2) / ( 0.000001 + vignettingBlur * SQRT_2), 0.0, 1.0);
        color.rgb *= darker;
    }

    gl_FragColor.rgb = color;
}
