Shader "Custom/SpinBlur"{
    Properties{
        tDiffuse("Color (RGB) Alpha (A)", 2D) = "white"
        angle ("Angle", Int) = 1
    }
    SubShader {
        Tags{ "Queue" = "Transparent" "RenderType" = "Transparent" }

        LOD 200
        Cull Off
            CGPROGRAM
            #pragma target 3.0
            #pragma surface surf Lambert alpha
            sampler2D tDiffuse;
            int angle;
            struct Input {
            float2 uvtDiffuse;
            float4 screenPos;
            };

            float2 rotateUV(float2 uv, float degrees) {
                const float Deg2Rad = (UNITY_PI * 2.0) / 360.0;
                float rotationRadians = degrees * Deg2Rad;
                float s = sin(rotationRadians);
                float c = cos(rotationRadians);
                float2x2 rotationMatrix = float2x2(c, -s, s, c);
                uv -= 0.5;
                uv = mul(rotationMatrix, uv);
                uv += 0.5;
                return uv;
            }

            void surf (Input IN, inout SurfaceOutput o){
                const float Deg2Rad = (UNITY_PI * 2.0) / 360.0;
                const float Rad2Deg = 180.0 / UNITY_PI;
                float2 vUv = IN.uvtDiffuse;
                float2 coord = vUv;
                float illuminationDecay = 1.0;
                float4 FragColor = float4(0.0, 0.0, 0.0, 0.0);
                int samp = angle;
                if (samp <= 0) samp = 1;
                for(float i=0; i < samp; i++){
                    coord = rotateUV(coord, angle/samp);
                    float4 texel = tex2D(tDiffuse, coord);
                    texel *= illuminationDecay * 1 / samp;
                    FragColor += texel;
                }
                float4 c = FragColor;
                o.Albedo = c.rgb;
                o.Alpha = c.a;
            }
            ENDCG
        }
    FallBack "Diffuse"
}
