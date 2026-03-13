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

	resizeCanvas() {
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
	}
}
