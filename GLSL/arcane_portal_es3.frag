#version 300 es
precision highp float;

out vec4 fragColor;

uniform float u_time;
uniform vec2 u_resolution;

const float H = 1.8;

float f(vec3 p) {
    float sdf = p.y;
    for (float j = 0.04; j < 6.0; j += j) {
        sdf += (abs(dot(sin(p.z * 0.1 + p / j), vec3(0.2))) - 0.1) * j;
    }
    return sdf;
}

float sabs(float x) {
    float a = 0.3;
    return sqrt(x * x + a * a) - a;
}

float f2(vec3 p) {
    float sdf = p.y;
    for (float j = 2.56; j < 6.0; j += j) {
        sdf += (sabs(dot(sin(p.z * 0.1 + p / j), vec3(0.2))) - 0.1) * j;
    }
    sdf = min(sdf, p.y + H);
    return sdf;
}

vec4 portal_target(float time, in vec3 ro, in vec3 rd) {
    vec4 fragCol;
    vec3 col = vec3(0.0);
    ro -= vec3(0.0, 0.8, 4.0 * time);
    ro.x += -sin(time * 0.2) * 10.0;
    rd.xy *= mat2(cos(cos(time * 0.2) * 0.25 + vec4(0, -11, 11, 0)));

    float t = 0.0;
    ro.y += 0.2 - 1.5 * f2(ro);

    ro.y = 0.5 * (ro.y + H) + 0.5 * sabs(ro.y + H) - H;

    float angle = 0.2 * (
        ((f2(ro) - f2(ro + vec3(0, 0, 1))) * 0.75 + 0.15) +
        ((f2(ro + vec3(0, 0, -0.5)) - f2(ro + vec3(0, 0, 0.5))) * 0.75 + 0.15)
    );
    float C = cos(angle), S = sin(angle);
    mat2 M = mat2(C, S, -S, C);
    rd.yz *= M;

    float T = 1.0;
    float sdf = 9e9;
    for (int i = 0; i < 60 && t < 1e2; i++) {
        vec3 p = rd * t + ro;

        if (p.y < -H) {
            float fresnel = pow(clamp(1.0 + rd.y, 0.0, 1.0), 5.0);
            p.y = abs(p.y + H) - H;
            T = fresnel;
        }

        sdf = f(p);

        float dt = sdf * 0.65 + 1e-3;
        t += dt;
        if (abs(sdf) < 1e-3) {
            vec2 e = 5e-2 * vec2(0, 1);
            vec3 n = normalize(vec3(f(p + e.yxx), f(p + e.xyx), f(p + e.xxy)) - sdf);

            float fresnel = pow(clamp(1.0 + dot(n, rd), 0.0, 1.0), 5.0);
            col += fresnel;

            break;
        }
        col += (0.75 + 0.25 * sin(vec3(-1.75, 2.5, 1.3) + 2.4 * vec3(0.3, 0.6, 1.0) * sdf)) * 0.1 * sdf * exp2(-0.5 * sdf) * exp2(-0.1 * t) * T;
    }
    fragCol = vec4(col, 0.0);
    return fragCol;
}

float pi = 3.14159265;

vec3 triwave(vec3 x) {
    return abs(fract(0.5 * x / pi - 0.25) - 0.5) * 4.0 - 1.0;
}

void main() {
    vec2 fragCoord = gl_FragCoord.xy;
    vec2 r = u_resolution.xy;
    vec2 uv = (fragCoord.xy * 2.0 - r) / r.y;
    float t = u_time, d = 0.0, z = 0.0;

    float focal = 1.4;
    vec4 o = vec4(0, 0, 0, 1);
    vec2 portal_uv = uv;
    vec3 cam_pos = vec3(0.0, 1.5, 10.0);

    vec3 rd = normalize(vec3(uv, -focal));

    {
        float time = u_time * 0.25;
        cam_pos += vec3(1.5 * cos(time), 0.0, 2.0 * sin(time));
        float angle = cos(time) * 0.25;
        float c = cos(angle), s = sin(angle);
        rd.xz *= mat2(c, s, -s, c);
    }

    vec3 P = vec3(0.0, 2.3, 2.5);
    float h = 1.0;

    // intersect ground
    float g_hit_t = (-h - cam_pos.y) / rd.y;
    vec3 g_hit = g_hit_t * rd + cam_pos;

    // figure out portal reflection
    vec3 portal_cam_pos = cam_pos;
    vec3 portal_rd = rd;
    if (g_hit_t > 0.0 && g_hit.z > P.z) {
        vec3 A = vec3(-1.0, -h, P.z) - cam_pos;
        vec3 B = vec3(1.0, -h, P.z) - cam_pos;
        portal_rd = reflect(portal_rd, normalize(cross(A, B)));
    }

    vec4 portal_target_color = vec4(0.0);
    vec3 P2 = vec3(0.0, -2.0 * h - 2.3, 2.5); // portal pos
    float radius = smoothstep(0.0, 2.0, u_time) * 3.0;
    if (min(
        length(dot(P - cam_pos, rd) * rd + cam_pos - P),
        length(dot(P2 - cam_pos, rd) * rd + cam_pos - P2)
    ) < radius) {
        portal_target_color = portal_target(u_time, portal_cam_pos, portal_rd);
    }

    portal_target_color *= portal_target_color * 300.0;
    float D;
    float D2;
    vec3 p;
    float transmission = 1.0;

    for (float i = 0.0; i < 65.0 && z < 1e3; i++) {
        p = z * rd;
        vec3 q; // distorted p

        p += cam_pos;
        D = length(p - P) - radius;

        D2 = length((p - vec3(P.x, -h, P.z)) * vec3(1.5, 10.0, 1.5)) - radius;

        if (p.y < -h) { // reflect portal range
            p.y = abs(p.y + h) - h;
            float F0 = 0.15;

            transmission = 0.8 * (F0 + (1.0 - F0) * pow(clamp(1.0 + rd.y, 0.0, 1.0), 5.0));
        } else {
            transmission = 1.0;
        }

        p.y += 0.8 * sin(p.z * 2.0 + u_time * 2.0 - d * 12.0) * 0.3;

        float T = 2.5 * t - d * 14.0;
        float c = cos(T), s = sin(T);
        q = p - P;
        q.xy *= mat2(c, s, -s, c);

        for (float di = 1.0; di < 9.0; di++) q += triwave((q * di + t * 2.0)).yzx / di;

        d = 0.1 * abs(length(p - P) - radius - p.z * 0.0) + abs(q.z) * 0.1;
        z += min(abs(p.y + h) * 0.4 + 0.03, d);

        // accumulate color
        o += transmission *
            mix(
                (cos(d / 0.1 + vec4(1, 2, 2.5, 0)) + 1.0) / d * z,
                portal_target_color,
                smoothstep(0.0, -0.2, max(length(p - P) - radius, (p.z - P.z)))
            )
            + 2.0 * (cos(-4.5 * u_time + D / 0.1 + vec4(1, 2, 2.5, 0)) + 1.0) * exp2(-D * D) * z
            + 10.0 * (cos(vec4(1, 2, 2.5, 0)) + 1.0) * exp2(-abs(D2)) * z;
    }

    o = o / 1e4;
    o *= 1.0 - length(uv) * 0.2;
    o = sqrt(1.0 - exp(-1.5 * o * o));

    fragColor = o;
}
