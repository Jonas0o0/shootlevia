import SpriteSheetService from '../services/SpriteSheetService.ts';
import { type BonusType } from '../../../common/BonusType.ts';
import type { Frame } from '../Frame.ts';

class Bonus {
	nom: string;
	sprite: SpriteSheetService;
	type: BonusType;

	constructor(type: BonusType) {
		this.type = type;
		this.nom = type.nom;
		this.sprite = new SpriteSheetService(type.sprite, 0);
	}

	drawInHUD(ctx: CanvasRenderingContext2D, x: number, y: number): void {
		this.sprite.setRow(this.type.rows.HUD);
		const frame: Frame = this.sprite.getFrame();
		ctx.drawImage(
			frame.img,
			0,
			frame.y,
			frame.width,
			frame.height,
			x,
			y,
			frame.width,
			frame.height
		);
	}

	drawOnMap(ctx: CanvasRenderingContext2D, x: number, y: number): void {
		this.sprite.setRow(this.type.rows.MAP);
		const frame: Frame = this.sprite.getFrame();
		ctx.drawImage(
			frame.img,
			frame.x,
			frame.y,
			frame.width,
			frame.height,
			x,
			y,
			frame.width,
			frame.height
		);
	}

	drawOnPlayer(ctx: CanvasRenderingContext2D, x: number, y: number): void {
		console.log('je suis appeler');
		this.sprite.setRow(this.type.rows.PLAYER);
		const frame: Frame = this.sprite.getFrame();
		if (this.type.sprite === 'PASS_PASS') {
			y += 20;
		}
		ctx.drawImage(
			frame.img,
			0,
			frame.y,
			frame.width,
			frame.height,
			x,
			y,
			frame.width,
			frame.height
		);
	}
}

export default Bonus;
