// TouchDesigner GLSL TOP compatible version
// Setup in TD:
// 1. Create GLSL TOP
// 2. Set "Output Resolution" to your target size
// 3. In "Vectors 1" page, add uniform "u_resolution" with $resx, $resy
// 4. Time is automatically available via uTime uniform

out vec4 fragColor;

uniform float uTime;       // TD built-in time
uniform vec2 u_resolution; // Set via GLSL TOP parameters

#define r(a) mat2(cos(a - vec4(0, 11, 33, 0)))

void main() {
    vec2 F = gl_FragCoord.xy;
    vec2 R = u_resolution.xy;
    vec4 o = vec4(0.0);
    vec3 P, Q, rd = vec3((F - 0.5 * R) / R.y, 1.3), W;
    float g = 0.0, d = 1.0, ii = 0.0;
    rd.zy *= r(-0.2);

    for (float i = 0.0; i < 99.0; i++) {
        if (d <= 1e-4) break;
        ii = i;
        P = rd * (g += d * 0.3);
        P.z += uTime * 7.0 + 1.0;
        d = P.y + 2.0;

        for (int ai = 1; ai < 10; ai++) {
            float a = 2.0 * pow(2.0, float(ai - 1));
            if (a >= 6e2) break;
            Q = P * a;
            Q.xz *= r(a);
            d += 2.0 * abs(dot(Q - Q + 1.0, cos(Q.zxz * 0.1 + a))) / pow(a * 0.5, 1.2);
        }
        d = min(d, P.y + 8.0 + d * 0.35);
    }

    o = mix(o, vec4(mix(vec3(0.3, 0.0, 0.2), vec3(0.9, 0.5, 0.2), rd.y + 0.8), 1.0),
            1.0 - exp(-g * 0.05 - ii * 0.003));
    vec4 e = exp(2.0 * o * 2.0);
    o = (e - 1.0) / (e + 1.0); // tanh
    o = pow(o, vec4(1.4));

    fragColor = o;
}
