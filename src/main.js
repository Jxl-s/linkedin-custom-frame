// Import libraries
import * as THREE from "three";
import GUI from "lil-gui";

// Import shaders
import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";
import { injectFont } from "./util/font";

const IMAGE_SIZE = 720;

// Prepare the canvas and scene
const canvas = document.querySelector("canvas.webgl");
const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

// Prepare the renderer
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
const render = () => renderer.render(scene, camera);

renderer.setSize(IMAGE_SIZE, IMAGE_SIZE);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Prepare the textures
const textureLoader = new THREE.TextureLoader();
const alphaTexture = textureLoader.load("/textures/alpha.png", render);

// Prepare the SVG
const svgItem = document.getElementById("svg-item");
injectFont(svgItem);

svgItem.setAttribute("width", IMAGE_SIZE);
svgItem.setAttribute("height", IMAGE_SIZE);

// Debug attributes
const myData = {
	ringColor: "#cc2222",
	textContent: "#OPENTOWORK",
	fontSize: 56,
	fontSpacing: 10,
	fontRotation: 0,
	download: () => {
		// Prepare the SVG text
		const svgString = new XMLSerializer().serializeToString(svgItem);
		const svgBlob = new Blob([svgString], { type: "image/svg+xml" });
		const svgUrl = URL.createObjectURL(svgBlob);

		// Transform the SVG into an image
		const svgImg = new Image();
		svgImg.onload = () => {
			// Final render of the WebGL scene]
			render();

			// Place the WebGL canvas and SVG image onto a final canvas
			const finalCanvas = document.createElement("canvas");
			finalCanvas.width = IMAGE_SIZE;
			finalCanvas.height = IMAGE_SIZE;

			const ctx = finalCanvas.getContext("2d");
			ctx.drawImage(canvas, 0, 0, IMAGE_SIZE, IMAGE_SIZE);
			ctx.drawImage(svgImg, 0, 0, IMAGE_SIZE, IMAGE_SIZE);

			// Make a download link for the final image
			const link = document.createElement("a");
			link.download = "profile-picture.png";
			link.href = finalCanvas.toDataURL("image/png");
			link.click();

			URL.revokeObjectURL(svgUrl);
		};

		svgImg.src = svgUrl;
	},
};

// Debug GUI
const gui = new GUI();
gui.addColor(myData, "ringColor")
	.name("Ring Color")
	.onChange((color) => {
		material.uniforms.uRingColor.value.set(color);
		render();
	});

const svgTextPath = document.getElementById("svg-text-path");
const svgTextItem = document.getElementById("svg-text-item");

gui.add(myData, "textContent")
	.name("Text")
	.onChange((text) => {
		svgTextPath.textContent = text;
	});

gui.add(myData, "fontSize", 10, 100)
	.name("Font Size")
	.step(1)
	.onChange((size) => {
		svgTextItem.setAttribute("font-size", `${size}px`);
	});

gui.add(myData, "fontSpacing", 0, 50)
	.name("Letter Spacing")
	.step(1)
	.onChange((spacing) => {
		svgTextItem.setAttribute("letter-spacing", `${spacing}px`);
	});

gui.add(myData, "fontRotation", -60, 60)
	.name("Font Rotation")
	.step(1)
	.onChange((offset) => {
		svgTextItem.setAttribute("transform", `rotate(${offset} 360 360)`);
	});

gui.add(myData, "download").name("Download Picture");

// Create the shadermaterial
const material = new THREE.ShaderMaterial({
	uniforms: {
		uAlphaTexture: { value: alphaTexture },
		uBackgroundTexture: { value: null },
		uRingColor: { value: new THREE.Color(myData.ringColor) },
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

// Handle background image
document.getElementById("file-input").addEventListener("change", (event) => {
	const file = event.target.files[0];
	if (!file) return;

	const reader = new FileReader();
	reader.onload = (e) => {
		const img = new Image();
		img.onload = () => {
			// Update the background uniform
			const texture = new THREE.Texture(img);
			texture.needsUpdate = true;

			material.uniforms.uBackgroundTexture.value = texture;
			render();
		};

		img.src = e.target.result;
	};

	reader.readAsDataURL(file);
});
