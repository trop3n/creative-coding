// Expanding rings — glslCanvas-style (gl_FragColor/u_time/u_resolution).
#ifdef GL_ES
precision mediump float;
#endif
uniform vec2 u_resolution;
uniform float u_time;

void main() {
    vec2 uv = (2.0 * gl_FragCoord.xy - u_resolution) / u_resolution.y;
    float d = length(uv);
    float v = sin(d * 20.0 - u_time * 3.0) * 0.5 + 0.5;
    v *= smoothstep(1.2, 0.3, d);
    gl_FragColor = vec4(vec3(v * 0.9, v * 0.5, v), 1.0);
}
