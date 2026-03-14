import type { BulletData } from '../../../common/types.ts';

/**
 * Représente une balle tirée par le joueur dans le jeu
 */
export default class Bullet {
	id: string;
	x: number;
	y: number;
	width: number;
	height: number;
	ownerId: string;

	constructor(data: BulletData) {
		this.id = data.id;
		this.x = data.x;
		this.y = data.y;
		this.width = data.width;
		this.height = data.height;
		this.ownerId = data.ownerId;
	}

	updateFromData(data: BulletData) {
		this.x = data.x;
		this.y = data.y;
	}

	draw(ctx: CanvasRenderingContext2D) {
		ctx.fillStyle = 'yellow';
		ctx.fillRect(this.x, this.y, this.width, this.height);
		ctx.strokeStyle = 'orange';
		ctx.lineWidth = 1;
		ctx.strokeRect(this.x, this.y, this.width, this.height);
	}
}

