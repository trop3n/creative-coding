#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;

#define r(a) mat2(cos(a - vec4(0, 11, 33, 0)))

void main() {
    vec2 F = gl_FragCoord.xy;
    vec2 R = u_resolution.xy;
    vec4 o = vec4(0.0);
    vec3 P, Q, rd = vec3((F - 0.5 * R) / R.y, 1.3), W;
    float g = 0.0, d = 1.0, ii = 0.0;
    rd.zy *= r(-0.2);
    // rd.xz *= r(sin(u_time * 0.1));

    for (float i = 0.0; i < 99.0; i++) {
        if (d <= 1e-4) break;
        ii = i;
        P = rd * (g += d * 0.3);
        P.z += u_time * 7.0 + 1.0;
        d = P.y + 2.0;

        for (int ai = 1; ai < 10; ai++) {
            float a = 2.0 * pow(2.0, float(ai - 1));
            if (a >= 6e2) break;
            Q = P * a;
            Q.xz *= r(a);
            // W = pow(1.2 - abs(sin(Q.xzx * 0.14)), 1.3 * vec3(1., 3., 1.));
            // d -= abs(dot(W - .4, cos(Q.xyz * .125 - d * .7))) / a * 4.;
            d += 2.0 * abs(dot(Q - Q + 1.0, cos(Q.zxz * 0.1 + a))) / pow(a * 0.5, 1.2);           
        }
        d = min(d, P.y + 8.0 + d * 0.35);
    }

    o = mix(o, vec4(mix(vec3(0.3, 0.0, 0.2), vec3(0.9, 0.5, 0.2), rd.y + 0.8), 1.0),
            1.0 - exp(-g * 0.05 - ii * 0.003));
    vec4 e = exp(2.0 * o * 2.0);
    o = (e - 1.0) / (e + 1.0); // tanh(o * 2.0)
    o = pow(o, vec4(1.4));

    gl_FragColor = o;
}