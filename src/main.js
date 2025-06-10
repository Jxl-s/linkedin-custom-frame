// Import libraries
import { DEFAULT_OPTIONS, IMAGE_SIZE } from "./constants";
import { Canvas } from "./Canvas";
import { Debug } from "./Debug";

// Prepare the canvas
const canvas = new Canvas(
	document.querySelector("canvas"),
	DEFAULT_OPTIONS.ringColor,
);

// Prepare the SVG
const svgItem = document.getElementById("svg-item");
svgItem.setAttribute("width", IMAGE_SIZE);
svgItem.setAttribute("height", IMAGE_SIZE);
svgItem.setAttribute("viewBox", `0 0 ${IMAGE_SIZE} ${IMAGE_SIZE}`);

// Handle background input
const fileInput = document.getElementById("file-input");
fileInput.addEventListener("change", (event) => {
	const file = event.target.files[0];
	if (!file) return;

	canvas.updateImage(file);
});

// Debug attributes
new Debug({ ...DEFAULT_OPTIONS }, canvas, svgItem);
