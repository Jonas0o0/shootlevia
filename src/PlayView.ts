import View from './View.ts';

export default class PlayView extends View {
	canvas: HTMLCanvasElement;
	ctx: CanvasRenderingContext2D;

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
	}

	hide() {
		super.hide();
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}

	resizeCanvas() {
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
	}
}
