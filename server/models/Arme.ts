import { ServerBullet } from './Bullet.ts';
import type { HitBox } from '../../common/HitBox.ts';

export class Arme {
	public vitesse: number;
	public degat: number;
	public frequence: number;
	public bullets: ServerBullet[] = [];
	private lastShotTime: number = 0;
	public level: number = 0;

	constructor(vitesse: number, degat: number, frequence: number) {
		this.vitesse = vitesse;
		this.degat = degat;
		this.frequence = frequence;
	}

	shoot(ownerId: string, source: HitBox): void {
		const nbTirs = this.level + 1;
		
		const angleSpacing = 15;
		const maxSpread = 90;

		let currentSpread = (nbTirs - 1) * angleSpacing;
		if (currentSpread > maxSpread) {
			currentSpread = maxSpread;
		}

		const currentAngleMin = -currentSpread / 2;
		const currentAngleMax = currentSpread / 2;

		for (let i = 0; i < nbTirs; i++) {
			let angleDeg = 0;
			if (nbTirs > 1) {
				angleDeg = currentAngleMin + (currentAngleMax - currentAngleMin) * (i / (nbTirs - 1));
			} else {
				angleDeg = 0;
			}
			const angleRad = angleDeg * (Math.PI / 180);

			const bullet = new ServerBullet(
				ownerId,
				source.x + source.width,
				source.y + source.height / 2,
				this.vitesse,
				angleRad,
				this.degat
			);
			this.bullets.push(bullet);
		}
	}

	autoShoot(ownerId: string, source: HitBox): boolean {
		const now = Date.now();
		if (now - this.lastShotTime >= this.frequence) {
			this.shoot(ownerId, source);
			this.lastShotTime = now;
			return true;
		}
		return false;
	}

	levelUp(): void {
		this.level++;
		
		this.vitesse = Math.min(25, 5 + this.level);
		
		this.degat = 10 + (this.level * 5);
		
		const reductionFrequence = this.level * 50;
		this.frequence = Math.max(50, 500 - reductionFrequence);
	}

	levelHalf(): void {
		this.level = Math.floor(this.level / 2);
	}
	
	updateBullets(): void {
		this.bullets.forEach(bullet => bullet.update());
		this.bullets = this.bullets.filter(b => b.x < 2000);
	}
}
