import View from './View.ts';

export default class PlayView extends View {
	canvas: HTMLCanvasElement;
	ctx: CanvasRenderingContext2D;
	launchGameCallback?: () => void;

	constructor(
		element: Element,
		canvas: HTMLCanvasElement,
		ctx: CanvasRenderingContext2D
	) {
		super(element);
		this.canvas = canvas;
		this.ctx = ctx;

		window.addEventListener('resize', this.resizeCanvas);
	}

	show() {
		super.show();
		this.resizeCanvas();
		if (this.launchGameCallback) {
			this.launchGameCallback();
		}
	}

	hide() {
		super.hide();
	}

	resizeCanvas = () => {
		const targetWidth = 1920;
		const targetHeight = 1080;
		const targetRatio = targetWidth / targetHeight;

		const windowWidth = window.innerWidth;
		const windowHeight = window.innerHeight;
		const windowRatio = windowWidth / windowHeight;

		let newWidth, newHeight;

		if (windowRatio > targetRatio) {
			// Window is wider than canvas ratio (pillarbox)
			newHeight = windowHeight;
			newWidth = newHeight * targetRatio;
		} else {
			// Window is taller than canvas ratio (letterbox)
			newWidth = windowWidth;
			newHeight = newWidth / targetRatio;
		}

		this.canvas.style.width = newWidth + 'px';
		this.canvas.style.height = newHeight + 'px';
		this.canvas.style.left = (windowWidth - newWidth) / 2 + 'px';
		this.canvas.style.top = (windowHeight - newHeight) / 2 + 'px';
		
		// Internal resolution remains constant
		this.canvas.width = targetWidth;
		this.canvas.height = targetHeight;
	};
}
