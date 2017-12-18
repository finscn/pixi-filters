
varying vec2 vTextureCoord;
uniform sampler2D uSampler;

uniform vec2 uPixelSize;
uniform float uOffset;

void main(void)
{
    vec2 dUV = uPixelSize * (vec2(uOffset, uOffset) + 0.5);

    vec4 color = vec4(0.0);

    // Sample top left pixel
    color += texture2D(uSampler, vec2(vTextureCoord.x - dUV.x, vTextureCoord.y + dUV.y));

    // Sample top right pixel
    color += texture2D(uSampler, vec2(vTextureCoord.x + dUV.x, vTextureCoord.y + dUV.y));

    // Sample bottom right pixel
    color += texture2D(uSampler, vec2(vTextureCoord.x + dUV.x, vTextureCoord.y - dUV.y));

    // Sample bottom left pixel
    color += texture2D(uSampler, vec2(vTextureCoord.x - dUV.x, vTextureCoord.y - dUV.y));

    // Average
    color *= 0.25;

    gl_FragColor = color;
}
