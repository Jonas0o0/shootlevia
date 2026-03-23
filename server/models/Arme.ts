import { ServerBullet } from './Bullet.ts';
import type { HitBox } from '../../common/HitBox.ts';
import { WeaponLevel, WeaponUpgrades } from './WeaponUpgrades.ts';

export class Arme {
	public vitesse: number;
	public degat: number;
	public frequence: number;
	public bullets: ServerBullet[] = [];
	private lastShotTime: number = 0;
	public level: number = WeaponLevel.LEVEL1;

	constructor(vitesse: number, degat: number, frequence: number) {
		this.vitesse = vitesse;
		this.degat = degat;
		this.frequence = frequence;
	}

	shoot(ownerId: string, source: HitBox): void {
		const nbTirs = this.level + 1;
		
		// L'écart entre chaque balle (ex: 15 degrés par défaut)
		const angleSpacing = 15;
		// L'écart total maximal (de -45° à +45° = 90°)
		const maxSpread = 90;

		// On calcule l'écart total pour le niveau actuel, sans dépasser la limite
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
				angleDeg = 0; // Tir tout droit si nbTirs = 1
			}
			const angleRad = angleDeg * (Math.PI / 180);

			const bullet = new ServerBullet(
				ownerId,
				source.x + source.width,
				source.y + source.height / 2,
				this.vitesse,
				angleRad
			);
			this.bullets.push(bullet);
		}
	}

	autoShoot(ownerId: string, source: HitBox): void {
		const now = Date.now();
		if (now - this.lastShotTime >= this.frequence) {
			this.shoot(ownerId, source);
			this.lastShotTime = now;
		}
	}

	levelUp(): void {
		this.level++;
		const nextStats = WeaponUpgrades[this.level as WeaponLevel];
		if (nextStats) {
			this.vitesse = nextStats.vitesse;
			this.degat = nextStats.degat;
			this.frequence = nextStats.frequence;
		}
	}

	updateBullets(): void {
		this.bullets.forEach(bullet => bullet.update());
		this.bullets = this.bullets.filter(b => b.x < 2000);
	}
}
