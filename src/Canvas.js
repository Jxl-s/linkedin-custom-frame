import { IMAGE_SIZE } from "./constants";

export class Canvas {
	constructor(canvas, ringColor) {
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d");

		this.backgroundImg = new Image();
		this.backgroundImg.onload = () => this.render();

		this.alphaLoaded = false;
		this.ringColor = ringColor;

		this.initCanvas();
		this.initAlpha();
	}

	initCanvas() {
		this.canvas.width = IMAGE_SIZE;
		this.canvas.height = IMAGE_SIZE;
		this.canvas.style.width = IMAGE_SIZE + "px";
		this.canvas.style.height = IMAGE_SIZE + "px";
	}

	initAlpha() {
		this.alphaImg = new Image();
		this.alphaImg.onload = () => {
			this.alphaLoaded = true;
			this.render();
		};

		this.alphaImg.src = "/textures/alpha.png";
	}

	updateImage(file) {
		const reader = new FileReader();
		reader.onload = (e) => (this.backgroundImg.src = e.target.result);
		reader.readAsDataURL(file);
	}

	render() {
		// Clear canvas to transparent
		this.ctx.clearRect(0, 0, IMAGE_SIZE, IMAGE_SIZE);
		if (!this.alphaLoaded) return;

		// Draw background
		this.ctx.drawImage(this.backgroundImg, 0, 0, IMAGE_SIZE, IMAGE_SIZE);

		const imageData = this.ctx.getImageData(0, 0, IMAGE_SIZE, IMAGE_SIZE);
		const pixels = imageData.data;

		// Create a temporary canvas to get alpha texture pixel data
		const alphaCanvas = document.createElement("canvas");
		alphaCanvas.width = IMAGE_SIZE;
		alphaCanvas.height = IMAGE_SIZE;

		const alphaCtx = alphaCanvas.getContext("2d");
		alphaCtx.drawImage(this.alphaImg, 0, 0, IMAGE_SIZE, IMAGE_SIZE);

		const alphaData = alphaCtx.getImageData(
			0,
			0,
			IMAGE_SIZE,
			IMAGE_SIZE,
		).data;

		// Get ring color
		const ringColorHex = this.ringColor.replace("#", "");
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
		this.ctx.putImageData(imageData, 0, 0);
	}

	download(svgItem) {
		// Prepare the SVG text
		const svgString = new XMLSerializer().serializeToString(svgItem);
		const svgBlob = new Blob([svgString], { type: "image/svg+xml" });
		const svgUrl = URL.createObjectURL(svgBlob);

		// Transform the SVG into an image
		const svgImg = new Image();
		svgImg.onload = () => {
			// Final render
			this.render();

			// Create final canvas with SVG overlay
			const finalCanvas = document.createElement("canvas");
			finalCanvas.width = IMAGE_SIZE;
			finalCanvas.height = IMAGE_SIZE;

			// Draw the main canvas and the SVG image
			const finalCtx = finalCanvas.getContext("2d");
			finalCtx.drawImage(this.canvas, 0, 0);
			finalCtx.drawImage(svgImg, 0, 0, IMAGE_SIZE, IMAGE_SIZE);

			// Download final image
			const link = document.createElement("a");
			link.download = "profile-picture.png";
			link.href = finalCanvas.toDataURL("image/png");
			link.click();

			URL.revokeObjectURL(svgUrl);
		};

		svgImg.src = svgUrl;
	}
}

