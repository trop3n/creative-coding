#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;

#define t u_time
#define r u_resolution;

void main() {
    vec3 c;
    float l, z=t;
    for(int i = 0; i < 3; i++) {
        vec2 uv, p = gl_FragCoord.xy / r;
        uv= p;
        p -= .5;
        p.x *= u_resolution.x / u_resolution.y;
        z+=.07;
        l=length(p);
        uv+=p / l * (sin(z)+1.)*abs(sin(l * 9. - z - z));
        c[i] = .01 / length(mod(uv,1.) - .5);
    }
    gl_FragColor=vec4(c / l, t);
}