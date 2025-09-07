precision mediump float;

varying vec2 vTexCoord;

uniform vec2 resolution;
uniform float time;
uniform vec2 mouse;
uniform float izoom;
uniform int imaxIt;

uniform vec4 shift4;
uniform vec2 shift2;
uniform vec4 ax1_4;
uniform vec2 ax1_2;
uniform vec4 ax2_4;
uniform vec2 ax2_2;

// === fonctions complexes (reprends les tiennes) ===
vec2 cadd(vec2 a, vec2 b) { return a + b; }
vec2 cmul(vec2 a, vec2 b) { return vec2(a.x*b.x - a.y*b.y, a.x*b.y + a.y*b.x); }
vec2 cexp(vec2 z) {
    float e = exp(z.x);
    return vec2(e*cos(z.y), e*sin(z.y));
}
vec2 clog(vec2 z) {
    float m2 = max(dot(z,z), 1e-12);
    return vec2(0.5*log(m2), atan(z.y, z.x));
}

float divergence(vec2 z0, vec2 a, vec2 c) {
    vec2 z = z0;
    float bailout = 2000.0;

    for (int i = 0; i < 1000; i++) {
        if (i >= imaxIt) break;
        float m2 = dot(z,z);
        if (m2 > bailout) return float(i)/float(imaxIt); // divergent
        vec2 logz = clog(z);
        vec2 za = cexp(cmul(a, logz));
        z = cadd(za, c);
    }
    return 1.0; // non divergent
}

void main() {
    vec2 uv = (2.0*vTexCoord - vec2(1.0)) * izoom;
    uv.x *= (resolution.x / resolution.y);

    vec4 P4 = shift4 + ax1_4 * uv.x + ax2_4 * uv.y;
    vec2 P2 = shift2 + ax1_2 * uv.x + ax2_2 * uv.y;

    float di = divergence(vec2(P4.x, P4.y), P2, vec2(P4.z, P4.w));

    gl_FragColor = vec4(vec3(di), di); // alpha = 1 si diverge, 0 sinon
}