varying vec2 vTextureCoord;
uniform sampler2D uSampler;

uniform vec4 filterArea;
uniform vec4 filterClamp;

uniform float bandsWidth[%MAX_BAND_COUNT%];
uniform float bandsOffset[%MAX_BAND_COUNT%];
uniform int bandCount;

uniform float seed;
uniform float offset;
uniform vec2 ratio;
uniform vec2 red;
uniform vec2 green;
uniform vec2 blue;
uniform bool loop;

void main(void)
{
    float y = vTextureCoord.y / ratio.y;

    if (y > 1.0) {
        gl_FragColor = texture2D(uSampler, vTextureCoord);
        return;
    }

    float offsetUV = offset / filterArea.x;

    float x = vTextureCoord.x;

    vec2 tear;
    float min = 0.;
    for (int i = 0; i < %MAX_BAND_COUNT%; i++) {
        if (i >= bandCount) {
            break;
        }
        float width = bandsWidth[i];
        float max = min + width;
        if (y >= min && y < max) {
            tear.x = bandsOffset[i] * offsetUV;
            break;
        }
        min = max;
    }

    tear += vTextureCoord;

    if (!loop && (tear.x < filterClamp.x || tear.x > filterClamp.z)) {
        gl_FragColor = vec4(0., 0., 0., 0.);
        return;
    }

    tear.x = tear.x < filterClamp.x ? filterClamp.z + (tear.x - filterClamp.x) :
            (
                tear.x > filterClamp.z ? filterClamp.x + (tear.x - filterClamp.z) : tear.x
            );

    gl_FragColor.r = texture2D(uSampler, tear + red * (1.0 - seed * 0.4) / filterArea.xy).r;
    gl_FragColor.g = texture2D(uSampler, tear + green * (0.9 - seed * 0.3) / filterArea.xy).g;
    gl_FragColor.b = texture2D(uSampler, tear + blue * (0.8 - seed * 0.2) / filterArea.xy).b;
    gl_FragColor.a = texture2D(uSampler, tear).a;
}
