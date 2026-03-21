import SpriteSheetService from '../services/SpriteSheetService.ts';
import { type BonusType } from '../../../common/BonusType.ts';
import type { Frame } from '../Frame.ts';
import type { BonusData } from '../../../common/types.ts';
import type { HitBox } from '../../../common/HitBox.ts';

class Bonus implements HitBox {
	id: string;
	nom: string;
	sprite: SpriteSheetService;
	type: BonusType;
	x: number = 0;
	y: number = 0;
	width: number;
	height: number;

	constructor(typeOrData: BonusType | BonusData) {
		if ('id' in typeOrData) {
			// C'est un BonusData (depuis le serveur).
			this.id = typeOrData.id;
			this.type = typeOrData.type;
			this.x = typeOrData.x;
			this.y = typeOrData.y;
		} else {
			// C'est un BonusType (pour le HUD/joueur local)
			this.id = '';
			this.type = typeOrData;
		}
		this.nom = this.type.nom;
		this.sprite = new SpriteSheetService(this.type.sprite, 0);
		this.width = this.type.sheetSize.MAP.width;
		this.height = this.type.sheetSize.MAP.height;
	}

	updateFromData(data: BonusData): void {
		this.x = data.x;
		this.y = data.y;
	}

	drawInHUD(element: Element): void {
		this.sprite.setRow(this.type.rows.HUD);
		const frame: Frame = this.sprite.getFrame();
		const span = document.createElement('span');

		span.style.display = 'inline-block';
		span.style.width = `${this.type.sheetSize.HUD.width}px`;
		span.style.height = `${this.type.sheetSize.HUD.height}px`;
		span.style.backgroundImage = `url(${frame.img.src})`;
		span.style.backgroundPosition = `0px -${frame.y}px`;
		span.style.backgroundRepeat = 'no-repeat';
		element.querySelector('.bonus-container')?.appendChild(span);
	}

	drawOnMap(ctx: CanvasRenderingContext2D): void {
		this.sprite.setRow(this.type.rows.MAP);
		const frame: Frame = this.sprite.getFrame();
		ctx.drawImage(
			frame.img,
			frame.x,
			frame.y,
			frame.width,
			frame.height,
			this.x,
			this.y,
			frame.width,
			frame.height
		);
	}

	drawOnPlayer(ctx: CanvasRenderingContext2D, target: HitBox): void {
		this.sprite.setRow(this.type.rows.PLAYER);
		const frame: Frame = this.sprite.getFrame();
		let drawY = target.y;
		if (this.type.sprite === 'PASS_PASS') {
			drawY += 20;
		}
		ctx.drawImage(
			frame.img,
			0,
			frame.y,
			frame.width,
			frame.height,
			target.x,
			drawY,
			frame.width,
			frame.height
		);
	}
}

export default Bonus;
