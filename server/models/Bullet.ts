import type { BulletData } from '../../common/types.ts';
import type { HitBox } from '../../common/HitBox.ts';
import { Direction } from '../../common/Direction.ts';

/**
 * Représente une balle tirée par un joueur côté serveur
 */
export class ServerBullet implements HitBox {
	public id: string;
	public x: number;
	public y: number;
	public width: number = 10;
	public height: number = 5;
	public ownerId: string;
	
	public dx: number;
	public dy: number;

	constructor(ownerId: string, x: number, y: number, speed: number, direction: Direction = Direction.Right) {
		this.id = crypto.randomUUID();
		this.ownerId = ownerId;
		this.x = x;
		this.y = y;
		
		let angle = 0;
		if (direction === Direction.UR20) angle = -20 * (Math.PI / 180);
		if (direction === Direction.DR20) angle = 20 * (Math.PI / 180);
		if (direction === Direction.UR35) angle = -35 * (Math.PI / 180);
		if (direction === Direction.DR35) angle = 35 * (Math.PI / 180);
		if (direction === Direction.Up) angle = -90 * (Math.PI / 180);
		if (direction === Direction.Down) angle = 90 * (Math.PI / 180);
		if (direction === Direction.Left) angle = 180 * (Math.PI / 180);
		
		this.dx = speed * Math.cos(angle);
		this.dy = speed * Math.sin(angle);
	}

	update(): void {
		this.x += this.dx;
		this.y += this.dy;
	}

	/**
	 * Envoyer des informations d'une balle via le websocket
	 * @returns {BulletData} Un objet BulletData.
	 */
	toData(): BulletData {
		return {
			id: this.id,
			x: this.x,
			y: this.y,
			width: this.width,
			height: this.height,
			ownerId: this.ownerId,
		};
	}
}


