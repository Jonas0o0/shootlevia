import type { BulletData } from '../../common/types.ts';

/**
 * Représente une balle tirée par un joueur côté serveur
 */
export class ServerBullet {
	public id: string;
	public x: number;
	public y: number;
	public width: number = 10;
	public height: number = 5;
	public ownerId: string;
	/**
	 * Vitesse de déplacement de la balle
	 * @type {number}
	 * @private
	 */
	private speed: number = 10;

	constructor(ownerId: string, x: number, y: number) {
		this.id = crypto.randomUUID();
		this.ownerId = ownerId;
		this.x = x;
		this.y = y;
	}

	update(): void {
		this.x += this.speed;
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


