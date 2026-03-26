import type { BulletData } from '../../../common/types.ts';
import type { HitBox } from '../../../common/HitBox.ts';

/**
 * Représente une balle tirée par le joueur dans le jeu
 */
export default class Bullet implements HitBox {
	id: string;
	x: number;
	y: number;
	width: number;
	height: number;
	ownerId: string;
	type?: 'player' | 'enemy';

	constructor(data: BulletData) {
		this.id = data.id;
		this.x = data.x;
		this.y = data.y;
		this.width = data.width;
		this.height = data.height;
		this.ownerId = data.ownerId;
		this.type = data.type;
	}

	updateFromData(data: BulletData) {
		this.x = data.x;
		this.y = data.y;
		this.width = data.width;
		this.height = data.height;
		this.type = data.type;
	}

	draw(ctx: CanvasRenderingContext2D) {
		if (this.type === 'enemy') {
			ctx.beginPath();
			ctx.fillStyle = 'red';
			ctx.arc(
				this.x + this.width / 2,
				this.y + this.height / 2,
				this.width / 2,
				0,
				Math.PI * 2
			);
			ctx.fill();
			ctx.strokeStyle = 'darkred';
			ctx.lineWidth = 1;
			ctx.stroke();
			ctx.closePath();
		} else {
			ctx.fillStyle = 'yellow';
			ctx.fillRect(this.x, this.y, this.width, this.height);
			ctx.strokeStyle = 'orange';
			ctx.lineWidth = 1;
			ctx.strokeRect(this.x, this.y, this.width, this.height);
		}
	}
}

