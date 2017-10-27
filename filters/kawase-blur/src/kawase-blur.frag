
varying vec2 vTextureCoord;
uniform sampler2D uSampler;

uniform vec2 uPixelSize;
uniform float offset;


void main(void)
{
    vec2 dUV = uPixelSize * (vec2(offset, offset) + 0.5);

    vec4 color = vec4(0.0);

    // Sample top left pixel
    vec2 sampleCoord;
    sampleCoord.x = vTextureCoord.x - dUV.x;
    sampleCoord.y = vTextureCoord.y + dUV.y;
    color += texture2D(uSampler, sampleCoord);

    // Sample top right pixel
    sampleCoord.x = vTextureCoord.x + dUV.x;
    sampleCoord.y = vTextureCoord.y + dUV.y;
    color += texture2D(uSampler, sampleCoord);

    // Sample bottom right pixel
    sampleCoord.x = vTextureCoord.x + dUV.x;
    sampleCoord.y = vTextureCoord.y - dUV.y;
    color += texture2D(uSampler, sampleCoord);

    // Sample bottom left pixel
    sampleCoord.x = vTextureCoord.x - dUV.x;
    sampleCoord.y = vTextureCoord.y - dUV.y;
    color += texture2D(uSampler, sampleCoord);

    // Average
    color *= 0.25;

    gl_FragColor = color;
}
