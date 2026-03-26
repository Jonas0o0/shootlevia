import type { EnemyData } from '../../common/types.ts';
import { LifebarService } from '../../common/Service/LifebarService.ts';
import type { HitBox } from '../../common/HitBox.ts';
import { ServerBullet } from './Bullet.ts';

export class ServerEnemy implements HitBox {
	public id: string;
	public type: string;
	public x: number;
	public y: number;
	public vx: number;
	public vy: number;
	public width: number;
	public height: number;
	public health: LifebarService;
	private damageTimer: number = 0;
	private readonly DAMAGE_FEEDBACK_DURATION: number = 10;
	
	private shootCooldown: number = 120; // Valeur de base (2s)
	private lastShotTime: number = 0;

	constructor(
		id: string,
		type: string,
		x: number,
		y: number,
		vx: number,
		vy: number,
		health: number = 30
	) {
		this.id = id;
		this.type = type;
		this.x = x;
		this.y = y;
		this.vx = vx;
		this.vy = vy;
		this.width = 50;
		this.height = 50;
		this.health = new LifebarService(health);
		this.resetShootCooldown();
		this.lastShotTime = Math.floor(Math.random() * this.shootCooldown);
	}

	private resetShootCooldown(): void {
		// Intervalle irrégulier entre 1s et 3s (60 à 180 frames)
		this.shootCooldown = 60 + Math.random() * 120;
	}

	update(): void {
		this.x += this.vx;
		this.y += this.vy;
		if (this.damageTimer > 0) {
			this.damageTimer--;
		}
		if (this.lastShotTime > 0) {
			this.lastShotTime--;
		}
	}

	shoot(targetX?: number, targetY?: number): ServerBullet | null {
		if (this.type !== 'DRONE') return null;
		if (this.lastShotTime <= 0) {
			this.resetShootCooldown();
			this.lastShotTime = this.shootCooldown;

			let angle = Math.PI; // Par défaut vers la gauche
			if (targetX !== undefined && targetY !== undefined) {
				angle = Math.atan2(targetY - this.y, targetX - this.x);
			}

			return new ServerBullet(
				this.id,
				this.x,
				this.y + this.height / 2,
				7, // Vitesse augmentée (était 5)
				angle,
				10,
				'enemy',
				20, // Taille augmentée (était 15)
				20  // Taille augmentée (était 15)
			);
		}
		return null;
	}

	toData(): EnemyData {
		return {
			id: this.id,
			type: this.type,
			x: this.x,
			y: this.y,
			width: this.width,
			height: this.height,
			isDamaged: this.damageTimer > 0,
		};
	}

	takeDamage(damage: number): void {
		this.health.removeLife(damage);
		this.damageTimer = this.DAMAGE_FEEDBACK_DURATION;
	}

	isAlive(): boolean {
		return this.health.isAlive();
	}
}
