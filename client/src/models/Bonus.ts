import SpriteSheetService from '../services/SpriteSheetService.ts';
import { type BonusType } from '../../../common/BonusType.ts';
import type { Frame } from '../Frame.ts';
import type { BonusData } from '../../../common/types.ts';

class Bonus {
	id: string;
	nom: string;
	sprite: SpriteSheetService;
	type: BonusType;
	x: number = 0;
	y: number = 0;

	constructor(typeOrData: BonusType | BonusData) {
		if ('id' in typeOrData) {
			// C'est un BonusData (depuis le serveur)
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
		span.style.width = `${frame.width}px`;
		span.style.height = `${frame.height}px`;
		span.style.backgroundImage = `url(${frame.img.src})`;
		span.style.backgroundPosition = `0px -${frame.y}px`;
		span.style.backgroundRepeat = 'no-repeat';

		element.appendChild(span);
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
