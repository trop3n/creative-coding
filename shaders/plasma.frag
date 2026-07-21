// Classic plasma — Shadertoy-style entry point (mainImage/iTime/iResolution).
void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = (2.0 * fragCoord - iResolution.xy) / iResolution.y;
    float t = iTime;
    float v = 0.0;
    v += sin(uv.x * 6.0 + t);
    v += sin((uv.y + t) * 4.0);
    v += sin((uv.x + uv.y) * 5.0 + t * 1.5);
    v += sin(length(uv * 8.0) - t * 2.0);
    vec3 col = 0.5 + 0.5 * cos(v + vec3(0.0, 2.094, 4.188));
    fragColor = vec4(col, 1.0);
}
