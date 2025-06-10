// Import libraries
import GUI from "lil-gui";

const IMAGE_SIZE = 720;

// Prepare the canvas
const canvas = document.querySelector("canvas.webgl");
const ctx = canvas.getContext("2d");

canvas.width = IMAGE_SIZE;
canvas.height = IMAGE_SIZE;
canvas.style.width = `${IMAGE_SIZE}px`;
canvas.style.height = `${IMAGE_SIZE}px`;

// Load textures
const alphaImg = new Image();
const backgroundImg = new Image();

let backgroundLoaded = false;
let alphaLoaded = false;

// Prepare the SVG
const svgItem = document.getElementById("svg-item");
svgItem.setAttribute("width", IMAGE_SIZE);
svgItem.setAttribute("height", IMAGE_SIZE);

// Debug attributes
const myData = {
	ringColor: "#457032",
	textContent: "#OPENTOWORK",
	textUppercase: true,
	fontSize: 56,
	fontSpacing: 10,
	fontRotation: 0,
	fontOffset: 5,
	download: () => {
		// Prepare the SVG text
		const svgString = new XMLSerializer().serializeToString(svgItem);
		const svgBlob = new Blob([svgString], { type: "image/svg+xml" });
		const svgUrl = URL.createObjectURL(svgBlob);

		// Transform the SVG into an image
		const svgImg = new Image();
		svgImg.onload = () => {
			// Final render
			render();

			// Create final canvas with SVG overlay
			const finalCanvas = document.createElement("canvas");
			finalCanvas.width = IMAGE_SIZE;
			finalCanvas.height = IMAGE_SIZE;
			const finalCtx = finalCanvas.getContext("2d");

			// Draw the main canvas and the SVG image
			finalCtx.drawImage(canvas, 0, 0);
			finalCtx.drawImage(svgImg, 0, 0, IMAGE_SIZE, IMAGE_SIZE);

			// Download final image
			const link = document.createElement("a");
			link.download = "profile-picture.png";
			link.href = finalCanvas.toDataURL("image/png");
			link.click();

			URL.revokeObjectURL(svgUrl);
		};

		svgImg.src = svgUrl;
	},
};

// Render function
const render = () => {
	// Clear canvas to transparent
	ctx.clearRect(0, 0, IMAGE_SIZE, IMAGE_SIZE);
	if (!alphaLoaded) return;

	// Draw background
	ctx.drawImage(backgroundImg, 0, 0, IMAGE_SIZE, IMAGE_SIZE);

	const imageData = ctx.getImageData(0, 0, IMAGE_SIZE, IMAGE_SIZE);
	const pixels = imageData.data;

	// Create a temporary canvas to get alpha texture pixel data
	const alphaCanvas = document.createElement("canvas");
	alphaCanvas.width = IMAGE_SIZE;
	alphaCanvas.height = IMAGE_SIZE;

	const alphaCtx = alphaCanvas.getContext("2d");
	alphaCtx.drawImage(alphaImg, 0, 0, IMAGE_SIZE, IMAGE_SIZE);

	const alphaData = alphaCtx.getImageData(0, 0, IMAGE_SIZE, IMAGE_SIZE).data;

	// Get ring color
	const ringColorHex = myData.ringColor.replace("#", "");
	const ringR = parseInt(ringColorHex.substring(0, 2), 16);
	const ringG = parseInt(ringColorHex.substring(2, 4), 16);
	const ringB = parseInt(ringColorHex.substring(4, 6), 16);

	// mix(background, ringColor, alpha)
	for (let i = 0; i < pixels.length; i += 4) {
		const alphaValue = alphaData[i] / 255;
		const originalAlpha = pixels[i + 3];

		// Current background color
		const bgR = pixels[i];
		const bgG = pixels[i + 1];
		const bgB = pixels[i + 2];

		pixels[i] = bgR * (1 - alphaValue) + ringR * alphaValue;
		pixels[i + 1] = bgG * (1 - alphaValue) + ringG * alphaValue;
		pixels[i + 2] = bgB * (1 - alphaValue) + ringB * alphaValue;
		pixels[i + 3] = Math.max(originalAlpha, alphaValue * 255);
	}

	// Put the blended image data back
	ctx.putImageData(imageData, 0, 0);
};

// Load alpha texture
alphaImg.onload = () => {
	alphaLoaded = true;
	render();
};

alphaImg.src = "/textures/alpha.png";

// Debug GUI
const gui = new GUI();
gui.addColor(myData, "ringColor")
	.name("Ring Color")
	.onChange(() => {
		render();
	});

const svgTextPath = svgItem.querySelector("textPath");
const svgTextItem = svgItem.querySelector("text");

gui.add(myData, "textContent")
	.name("Text")
	.onChange((text) => {
		svgTextPath.textContent = text;
	});

gui.add(myData, "textUppercase")
	.name("Force Uppercase")
	.onChange((value) => {
		if (value) {
			svgTextItem.style.setProperty("text-transform", "uppercase");
		} else {
			svgTextItem.style.setProperty("text-transform", "");
		}
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

gui.add(myData, "fontOffset", -50, 50)
	.name("Font Offset")
	.step(1)
	.onChange((offset) => {
		svgTextItem.setAttribute("dy", offset);
	});

gui.add(myData, "download").name("Download Picture");

// Handle background image
document.getElementById("file-input").addEventListener("change", (event) => {
	const file = event.target.files[0];
	if (!file) return;

	const reader = new FileReader();
	reader.onload = (e) => {
		backgroundImg.onload = () => {
			backgroundLoaded = true;
			render();
		};
		backgroundImg.src = e.target.result;
	};

	reader.readAsDataURL(file);
});
