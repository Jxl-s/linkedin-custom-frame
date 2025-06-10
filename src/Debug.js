import GUI from "lil-gui";

export class Debug {
	constructor(debugUI, canvas, svgItem) {
		this.debugUI = debugUI;
		this.canvas = canvas;
		this.svgItem = svgItem;

		this.initDebugGUI();
	}

	initDebugGUI() {
		const svgTextPath = this.svgItem.querySelector("textPath");
		const svgTextItem = this.svgItem.querySelector("text");

		// Debug GUI
		const gui = new GUI();
		gui.addColor(this.debugUI, "ringColor")
			.name("Ring Color")
			.onChange((val) => {
				this.canvas.ringColor = val;
				this.canvas.render();
			});

		gui.add(this.debugUI, "textContent")
			.name("Text")
			.onChange((val) => {
				svgTextPath.textContent = val;
			});

		gui.add(this.debugUI, "textUppercase")
			.name("Force Uppercase")
			.onChange((val) => {
				if (val) {
					svgTextItem.style.setProperty(
						"text-transform",
						"uppercase",
					);
				} else {
					svgTextItem.style.setProperty("text-transform", "");
				}
			});

		gui.add(this.debugUI, "fontSize", 10, 100)
			.name("Font Size")
			.step(1)
			.onChange((val) => {
				svgTextItem.setAttribute("font-size", `${val}px`);
			});

		gui.add(this.debugUI, "fontSpacing", 0, 50)
			.name("Letter Spacing")
			.step(1)
			.onChange((val) => {
				svgTextItem.setAttribute("letter-spacing", `${val}px`);
			});

		gui.add(this.debugUI, "fontRotation", -60, 60)
			.name("Font Rotation")
			.step(1)
			.onChange((val) => {
				svgTextItem.setAttribute("transform", `rotate(${val} 360 360)`);
			});

		gui.add(this.debugUI, "fontOffset", -50, 50)
			.name("Font Offset")
			.step(1)
			.onChange((val) => {
				svgTextItem.setAttribute("dy", val);
			});

		// Add download button
		this.debugUI.download = () => this.canvas.download(this.svgItem);
		gui.add(this.debugUI, "download").name("Download Picture");
	}
}
