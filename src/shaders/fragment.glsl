uniform sampler2D uAlphaTexture;
uniform sampler2D uBackgroundTexture;
uniform vec3 uRingColor;
varying vec2 vUv;

void main() {
    float alpha = texture2D(uAlphaTexture, vUv).r;
    vec3 color = texture2D(uBackgroundTexture, vUv).rgb;
    color = mix(color, uRingColor, alpha);
    gl_FragColor = vec4(color, 1.0);
}
