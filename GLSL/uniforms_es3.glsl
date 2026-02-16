#version 300 es
precision highp float;

out vec4 fragColor;

uniform float u_time;

void main() {
    fragColor = vec4(abs(sin(u_time)), 0.0, 0.0, 1.0);
}
