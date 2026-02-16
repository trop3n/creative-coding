#version 300 es
precision highp float;

out vec4 fragColor;

uniform float u_time;
uniform vec2 u_resolution;

#define t u_time

void main() {
    vec3 c;
    float l, z = t;
    for (int i = 0; i < 3; i++) {
        vec2 uv, p = gl_FragCoord.xy / u_resolution;
        uv = p;
        p -= 0.5;
        p.x *= u_resolution.x / u_resolution.y;
        z += 0.07;
        l = length(p);
        uv += p / l * (sin(z) + 1.0) * abs(sin(l * 9.0 - z - z));
        c[i] = 0.01 / length(mod(uv, 1.0) - 0.5);
    }
    fragColor = vec4(c / l, t);
}
