#version 300 es
precision highp float;

out vec4 fragColor;

uniform float u_time;
uniform vec2 u_resolution;

// Torus signed distance function
// t.x = major radius, t.y = minor radius
float sdTorus(vec3 p, vec2 t) {
    vec2 q = vec2(length(p.xz) - t.x, p.y);
    return length(q) - t.y;
}

// Rotation Matrices
mat3 rotateX(float a) {
    float c = cos(a), s = sin(a);
    return mat3(1.0, 0.0, 0.0,
                0.0, c, -s,
                0.0, s, c);
}

mat3 rotateZ(float a) {
    float c = cos(a), s = sin(a);
    return mat3(c, -s, 0.0,
                s, c, 0.0,
                0.0, 0.0, 1.0);
}

// Ray Marching the scene
float march(vec3 ro, vec3 rd, mat3 rot) {
    float t = 0.0;
    for (int i = 0; i < 64; i++) {
        vec3 p = ro + rd * t;
        p = rot * p;
        float d = sdTorus(p, vec2(1.0, 0.4));
        if (d < 0.001 || t > 20.0) break;
        t += d;
    }
    return t;
}

// Get normal at point
vec3 getNormal(vec3 p, mat3 rot) {
    vec2 e = vec2(0.001, 0.0);
    vec3 rp = rot * p;
    return normalize(vec3(
        sdTorus(rot * (p + e.xyy), vec2(1.0, 0.4)) - sdTorus(rot * (p - e.xyy), vec2(1.0, 0.4)),
        sdTorus(rot * (p + e.yxy), vec2(1.0, 0.4)) - sdTorus(rot * (p - e.yxy), vec2(1.0, 0.4)),
        sdTorus(rot * (p + e.yyx), vec2(1.0, 0.4)) - sdTorus(rot * (p - e.yyx), vec2(1.0, 0.4))
    ));
}

// ASCII character bitmaps (5x7 grid encoded)
// Characters: " .,-~:;*#$@"
float getChar(int c, vec2 p) {
    if (p.x < 0.0 || p.x > 1.0 || p.y < 0.0 || p.y > 1.0) return 0.0;

    int x = int(p.x * 5.0);
    int y = int(p.y * 7.0);
    int bit = x + y * 5;

    int pattern = 0;

    // space
    if (c == 0) pattern = 0;
    // .
    else if (c == 1) pattern = 0x0000000C;
    // ,
    else if (c == 2) pattern = 0x0000000C;
    // -
    else if (c == 3) pattern = 0x00007000;
    // ~
    else if (c == 4) pattern = 0x00015400;
    // :
    else if (c == 5) pattern = 0x000C0600;
    // ;
    else if (c == 6) pattern = 0x000C0006;
    // =
    else if (c == 7) pattern = 0x000E0700;
    // !
    else if (c == 8) pattern = 0x00421084;
    // *
    else if (c == 9) pattern = 0x00015710;
    // #
    else if (c == 10) pattern = 0x02AFABEA;
    // $
    else if (c == 11) pattern = 0x01F4711F;
    // @
    else if (c == 12) pattern = 0x1F8FEBE1;

    // extract bit using native bitwise ops (GLSL ES 3.00)
    return float((pattern >> bit) & 1);
}

void main() {
    // grid setup - terminal like cells
    float charsX = 80.0;
    float aspect = u_resolution.x / u_resolution.y;
    float charsY = charsX / aspect / 2.0; // characters are ~2:1 tall

    vec2 cell = floor(gl_FragCoord.xy / u_resolution.xy * vec2(charsX, charsY));
    vec2 cellUV = fract(gl_FragCoord.xy / u_resolution.xy * vec2(charsX, charsY));

    // Flip Y for correct orientation
    cellUV.y = 1.0 - cellUV.y;

    // Normalized coordinates for ray marching
    vec2 uv = (cell - vec2(charsX, charsY) * 0.5) / charsY;

    // Animation - rotating donut
    float A = u_time;
    float B = u_time * 0.7;
    mat3 rot = rotateX(A) * rotateZ(B);

    // camera setup
    vec3 ro = vec3(0.0, 0.0, 4.0);
    vec3 rd = normalize(vec3(uv, -1.5));

    // ray march
    float t = march(ro, rd, rot);

    // calculate luminance
    float lum = 0.0;
    if (t < 20.0) {
        vec3 p = ro + rd * t;
        vec3 n = getNormal(p, rot);

        // light from upper-right front (like original)
        vec3 light1 = normalize(vec3(0.0, 1.0, 1.0));
        vec3 light2 = normalize(vec3(1.0, 1.0, 0.0));

        float diff = max(dot(n, light1), 0.0);
        diff += max(dot(n, light2), 0.0) * 0.5;
        lum = diff;
    }

    // map luminance to character index (0-12)
    int charIndex = int(clamp(lum * 12.0, 0.0, 12.0));

    // get pixel from character bitmap
    float pixel = getChar(charIndex, cellUV);

    // green terminal color
    vec3 bgColor = vec3(0.0, 0.02, 0.0);
    vec3 fgColor = vec3(0.0, 1.0, 0.3);

    // Slight scanline effect
    float scanline = 0.9 + 0.1 * sin(gl_FragCoord.y * 2.0);

    vec3 color = mix(bgColor, fgColor * scanline, pixel);

    // CRT glow effect
    color += fgColor * pixel * 0.2 * exp(-length(cellUV - 0.5) * 2.0);

    fragColor = vec4(color, 1.0);
}
