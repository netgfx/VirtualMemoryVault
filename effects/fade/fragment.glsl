uniform vec2      u_resolution;
uniform float     u_time;
uniform sampler2D uTexture;
uniform float     fade_size;
uniform float     mask_position;
varying vec2 vUv;
void main() {
    //vec2 vUv = gl_FragCoord.xy/u_resolution.xy;
    
    vec4 color = texture2D(uTexture, vUv);
                
    float start_p = mask_position-fade_size;
    float end_p   = mask_position+fade_size;
    float p       = mix(fade_size, 1.0-fade_size, vUv.x);
    color.rgba *= 1.0 - smoothstep(start_p, end_p, p);
    if ( color.a < 0.01 )
          discard;

    gl_FragColor = color;
}