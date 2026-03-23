import { Direction } from '../../common/Direction.ts';
import { ServerBullet } from './Bullet.ts';
import type { HitBox } from '../../common/HitBox.ts';
import { WeaponLevel, WeaponUpgrades } from './WeaponUpgrades.ts';

export class Arme {
	public vitesse: number;
	public direction: Direction[];
	public degat: number;
	public frequence: number;
	public bullets: ServerBullet[] = [];
	private lastShotTime: number = 0;
	public level: number = WeaponLevel.LEVEL1;

	constructor(vitesse: number, direction: Direction[], degat: number, frequence: number) {
		this.vitesse = vitesse;
		this.direction = direction;
		this.degat = degat;
		this.frequence = frequence;
	}

	shoot(ownerId: string, source: HitBox): void {
		this.direction.forEach(dir => {
			const bullet = new ServerBullet(
				ownerId,
				source.x + source.width,
				source.y + source.height / 2,
				this.vitesse,
				dir
			);
			this.bullets.push(bullet);
		});
	}

	autoShoot(ownerId: string, source: HitBox): void {
		const now = Date.now();
		if (now - this.lastShotTime >= this.frequence) {
			this.shoot(ownerId, source);
			this.lastShotTime = now;
		}
	}

	levelUp(): void {
		if (this.level < WeaponLevel.LEVEL5) {
			this.level++;
			const stats = WeaponUpgrades[this.level as WeaponLevel];
			this.vitesse = stats.vitesse;
			this.direction = stats.direction;
			this.degat = stats.degat;
			this.frequence = stats.frequence;
		}
	}

	updateBullets(): void {
		this.bullets.forEach(bullet => bullet.update());
		this.bullets = this.bullets.filter(b => b.x < 2000);
	}
}
