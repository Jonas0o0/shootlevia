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

		window.addEventListener('resize', this.updateCanvasSize);
	}

	show() {
		super.show();
		this.updateCanvasSize();
	}

	hide() {
		super.hide();
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}

	private updateCanvasSize() {
		const dpr = window.devicePixelRatio || 1;
		const displayWidth = this.canvas.clientWidth;
		const displayHeight = this.canvas.clientHeight;

		if (displayWidth <= 0 || displayHeight <= 0) {
			return;
		}

		this.canvas.width = Math.floor(displayWidth * dpr);
		this.canvas.height = Math.floor(displayHeight * dpr);

		this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
	}
}
