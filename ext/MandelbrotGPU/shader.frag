precision mediump float;

varying vec2 vTexCoord;

const float bailout = 2000.0;

uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;
uniform float izoom;
uniform int imaxIt;

// === Ajout pour caméra 6D ===
uniform vec4 shift4;  // (z0.x, z0.y, c.x, c.y)
uniform vec2 shift2;  // (a.x, a.y)

uniform vec4 ax1_4;   // axe 1 pour (z0, c)
uniform vec2 ax1_2;   // axe 1 pour (a)
uniform vec4 ax2_4;   // axe 2 pour (z0, c)
uniform vec2 ax2_2;   // axe 2 pour (a)

vec2 cadd(vec2 a, vec2 b) { return a + b; }
vec2 cmul(vec2 a, vec2 b) { return vec2(a.x*b.x - a.y*b.y, a.x*b.y + a.y*b.x); }
vec2 cexp(vec2 z) {
    float e = exp(z.x);
    return vec2(e*cos(z.y), e*sin(z.y));
}
vec2 clog(vec2 z) {
    float m2 = max(dot(z,z), 1e-12); // évite log(0)
    return vec2(0.5*log(m2), atan(z.y, z.x));
}

vec3 distanceFractal(in vec2 z0, in vec2 a, in vec2 c)
{
    vec2 z = z0;

    // dérivées partielles
    vec2 u = vec2(1.0, 0.0); // ∂z/∂z0
    vec2 v = vec2(0.0, 0.0); // ∂z/∂a
    vec2 w = vec2(0.0, 0.0); // ∂z/∂c

    //float bailout = 1024.0;
    float di = 1.0;
    float m2 = 0.0;
    int it = 0;

    for (int i=0; i<1000; i++){
        if (i >= imaxIt) break;
        it += 1;

        m2 = dot(z,z);
        if (m2 > bailout) { di = 0.0; break; }

        vec2 logz = vec2(0.0);
        if (i > 0 && m2 > 1e-12) {
            logz = clog(z);
        }
        // z^a
        vec2 za   = cexp(cmul(a, clog(z))); // z^a = exp(a*Log(z))

        // f'(z) = a*z^(a-1)
        vec2 fdz  = cmul(a, cexp(cmul((a - vec2(1.0,0.0)), logz)));

        // propagate derivatives
        u = cmul(fdz, u);

        // update orbit
        z = cadd(za, c);
    }

    // norme du gradient (dans R^6)
    float gradNorm2 = dot(u,u); //retirer dot(v,v) car ajout d'artefact

    // distance
    float d = 0.5 * sqrt(m2 / gradNorm2) * log(m2);
    if (di > 0.5) d = 0.0;

    //retour vec3 d (distance estimée), float it (nombre d'itérations), float m2 (|z|^2 du dernier point calculé)
    return vec3(d, float(it), m2);
}

vec3 getColor(int index) {

    int nbColors = 4;
    int i = int(mod(float(index), float(nbColors)));

    if (i == 0) {
        return vec3(0.0, 0.0, 0.0);
    } else if (i == 1) {
        return vec3(0.0, 0.02, 0.60); 
    } else if (i == 2) {
        return vec3(0.8, 0.8, 0.8);
    } else if (i == 3) {
        return vec3(0.0, 0.02, 0.37); //return vec3(0.7, 0.34, 0.00);
    } 
        
    return vec3(0.0, 1.0, 0.0); //ugly color when wrong index
}

void main()
{
    // animation	
	float tz = 0.5 - 0.5*cos(0.225*time);
    float zoo = 1.0;// pow( 0.5, 15.0*tz );
    float t = 0.5 + cos(time)*0.5;

    // coords normalisées écran
    vec2 uv = (2.0*vTexCoord - vec2(1.0))*izoom;
    uv.x *= (resolution.x / resolution.y);

    // Projection dans espace 6D
    vec4 P4 = shift4 + ax1_4 * uv.x + ax2_4 * uv.y;
    vec2 P2 = shift2 + ax1_2 * uv.x + ax2_2 * uv.y;

    // Reconstruction
    vec2 z0 = vec2(P4.x, P4.y);
    vec2 c = vec2(P4.z, P4.w);
    vec2 a = P2;

    vec3 d = distanceFractal(z0,a,c);
    
	float shadow = clamp( pow(4.0*d.x/izoom,0.15), 0.0, 1.0 )*2.5;    

    float colorChangeSpeed = 0.15;
    float colorIndex = (d.y + 1.0 - log(log(d.z)) / 0.6931471805599) * colorChangeSpeed;   

    int colI1 = int(colorIndex); 
    int colI2 = int(colorIndex+1.0); 

    vec3 col = mix(getColor(colI1), getColor(colI2), fract(colorIndex));

    col = col*shadow;
    
    gl_FragColor = vec4( col, 1.0 );
}