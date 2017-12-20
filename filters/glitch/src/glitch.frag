varying vec2 vTextureCoord;
uniform sampler2D uSampler;

uniform vec4 filterArea;
uniform vec4 filterClamp;

uniform float rowsData[%ROW_COUNT%];

uniform float maxOffset;
uniform float seed;

void main(void)
{
    // gl_FragColor = texture2D(uSampler, vTextureCoord);
    seed;

    float w = maxOffset / filterArea.x;

    float x = vTextureCoord.x;
    float y = vTextureCoord.y;

    float offset = 0.;
    float m = 0.;
    for (int i = 0; i < %ROW_COUNT%; i++) {
        float height = float(abs(rowsData[i]));
        if (y >= m && y < m + height) {
            offset = sign(rowsData[%ROW_COUNT% - 1 - i]) * w * (seed * 0.1 + 0.001) * float(i / 2) ;
            break;
        }
        m += height;
    }

    float p = (seed - 0.5) * 4.0 / filterArea.x;

    gl_FragColor = texture2D(uSampler, vTextureCoord);
    gl_FragColor.r = texture2D(uSampler, vec2(x + p * 0. + offset * 1.1, y)).r;
    gl_FragColor.g = texture2D(uSampler, vec2(x + p * 1. + offset * 1.0, y)).g;
    gl_FragColor.b = texture2D(uSampler, vec2(x + p * -1. + offset * 0.8, y)).b;
}
