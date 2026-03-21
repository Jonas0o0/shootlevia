import { Direction } from '../../common/Direction.ts';
import { ServerBullet } from './Bullet.ts';
import type { HitBox } from '../../common/HitBox.ts';

export class Arme {
	public vitesse: number;
	public direction: Direction[];
	public degat: number;
	public frequence: number;
	public bullets: ServerBullet[] = [];
	private lastShotTime: number = 0;

	constructor(vitesse: number, direction: Direction[], degat: number, frequence: number) {
		this.vitesse = vitesse;
		this.direction = direction;
		this.degat = degat;
		this.frequence = frequence;
	}

	shoot(ownerId: string, source: HitBox): void {
		const bullet = new ServerBullet(
			ownerId,
			source.x + source.width,
			source.y + source.height / 2,
			this.vitesse,
		);
		this.bullets.push(bullet);
	}

	autoShoot(ownerId: string, source: HitBox): void {
		const now = Date.now();
		if (now - this.lastShotTime >= this.frequence) {
			this.shoot(ownerId, source);
			this.lastShotTime = now;
		}
	}

	updateBullets(): void {
		this.bullets.forEach(bullet => bullet.update());
		this.bullets = this.bullets.filter(b => b.x < 2000);
	}
}
