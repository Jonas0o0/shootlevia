import View from './View.ts';
import { PlaySpriteSheet } from './SpriteSheetConfig.ts';
import SpriteSheetService from './services/SpriteSheetService.ts';
import type { Frame } from './Frame.ts';

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
		const spriteSheetService: SpriteSheetService = new SpriteSheetService(
			PlaySpriteSheet.PLAYER,
			0
		);
		spriteSheetService.getFrame();
		const frame: Frame = spriteSheetService.getFrame();
		console.log(frame);
		this.ctx.drawImage(
			frame.img,
			frame.x,
			frame.y,
			frame.width,
			frame.height,
			50,
			50,
			frame.width,
			frame.height
		);
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
