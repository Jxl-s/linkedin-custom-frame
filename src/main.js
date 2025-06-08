import * as THREE from "three";
import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";

const canvas = document.querySelector("canvas.webgl");
const scene = new THREE.Scene();

const textureLoader = new THREE.TextureLoader();
const alphaTexture = textureLoader.load("/textures/alpha.png");

const material = new THREE.ShaderMaterial({
  uniforms: {
    uAlphaTexture: { value: alphaTexture },
    uRingColor: { value: new THREE.Color(0xcc2222) },
  },
  vertexShader,
  fragmentShader,
  transparent: true,
});

// Make the quad geometry
const geometry = new THREE.BufferGeometry();
const vertices = new Float32Array([-1, -1, 0, 1, -1, 0, -1, 1, 0, 1, 1, 0]);
const uvs = new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]);
const indices = new Uint16Array([0, 1, 2, 2, 1, 3]);

geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
geometry.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
geometry.setIndex(new THREE.BufferAttribute(indices, 1));

const quad = new THREE.Mesh(geometry, material);
scene.add(quad);

const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

// Make the renderer for linkedin size, pictures are 720x720
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
renderer.setSize(720, 720);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();
