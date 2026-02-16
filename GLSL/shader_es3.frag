#version 300 es
precision highp float;

out vec4 fragColor;

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

in vec2 v_texcoord;

void main(void) {
    vec4 color = vec4(vec3(0.0), 1.0);
    vec2 pixel = 1.0 / u_resolution.xy;
    vec2 st = gl_FragCoord.xy * pixel;

    color.rgb = vec3(st.x, st.y, abs(sin(u_time)));

    fragColor = color;
}
