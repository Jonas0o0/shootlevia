import { Direction } from '../../common/Direction.ts';
import { ServerBullet } from './Bullet.ts';

export class Arme {
	public vitesse: number;
	public direction: Direction[];
	public degat: number;
	//public frequence: number;
	public bullets: ServerBullet[] = [];

	constructor(vitesse: number, direction: Direction[], degat: number, /*frequence: number*/) {
		this.vitesse = vitesse;
		this.direction = direction;
		this.degat = degat;
		//this.frequence = frequence;
	}

	shoot(ownerId: string, x: number, y: number): void {
		const bullet = new ServerBullet(ownerId, x, y, this.vitesse);
		this.bullets.push(bullet);
	}

	updateBullets(): void {
		this.bullets.forEach(bullet => bullet.update());
		this.bullets = this.bullets.filter(b => b.x < 2000);
	}
}
