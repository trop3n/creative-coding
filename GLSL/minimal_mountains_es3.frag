#version 300 es
precision highp float;

out vec4 fragColor;

uniform float u_time;
uniform vec2 u_resolution;

#define r(a) mat2(cos(a - vec4(0, 11, 33, 0)))

void main() {
    vec2 F = gl_FragCoord.xy;
    vec2 R = u_resolution.xy;
    vec4 o = vec4(0.0);
    vec3 P, Q, rd = vec3((F - 0.5 * R) / R.y, 1.3), W;
    float g = 0.0, d = 1.0, i = 0.0;
    rd.zy *= r(-0.2);

    for (; i < 99.0 && d > 1e-4; i++) {
        P = rd * (g += d * 0.3);
        P.z += u_time * 7.0 + 1.0;
        d = P.y + 2.0;

        for (float a = 2.0; a < 6e2; a += a) {
            Q = P * a;
            Q.xz *= r(a);
            d += 2.0 * abs(dot(Q - Q + 1.0, cos(Q.zxz * 0.1 + a))) / pow(a * 0.5, 1.2);
        }
        d = min(d, P.y + 8.0 + d * 0.35);
    }

    o = mix(o, vec4(mix(vec3(0.3, 0.0, 0.2), vec3(0.9, 0.5, 0.2), rd.y + 0.8), 1.0),
            1.0 - exp(-g * 0.05 - i * 0.003));
    o = tanh(o * 2.0);  // Native tanh in ES 3.00!
    o = pow(o, vec4(1.4));

    fragColor = o;
}
