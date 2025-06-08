uniform sampler2D uAlphaTexture;
uniform vec3 uRingColor;
varying vec2 vUv;

void main() {
    float alpha = texture2D(uAlphaTexture, vUv).r;
    gl_FragColor = vec4(uRingColor, alpha);
}
