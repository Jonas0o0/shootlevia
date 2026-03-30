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
	
	private shootCooldown: number = 300; // Valeur de base (2s)
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

		if (this.type === 'BUS_RELAY') {
			this.width = 560;
			this.height = 176;
		} else {
			this.width = 50;
			this.height = 50;
		}

		this.health = new LifebarService(health);
		this.resetShootCooldown();
		this.lastShotTime = Math.floor(Math.random() * this.shootCooldown);
	}

	private resetShootCooldown(): void {
		if (this.type === 'BUS_RELAY') {
			this.shootCooldown = 90 + Math.random() * 60;
		} else {
			this.shootCooldown = 180 + Math.random() * 300;
		}
	}

	update(): void {
		this.x += this.vx;
		this.y += this.vy;

		if (this.type === 'BUS_RELAY') {

			const minY = 1080 * 0.1;
			const maxY = 1080 - this.height;
			
			if (this.y <= minY) {
				this.y = minY;
				this.vy = Math.abs(this.vy);
			} else if (this.y >= maxY) {
				this.y = maxY;
				this.vy = -Math.abs(this.vy);
			}
		}

		if (this.damageTimer > 0) {
			this.damageTimer--;
		}
		if (this.lastShotTime > 0) {
			this.lastShotTime--;
		}
	}

	shoot(targetX?: number, targetY?: number): ServerBullet | ServerBullet[] | null {
		if (this.type !== 'DRONE' && this.type !== 'BUS_RELAY') return null;
		
		if (this.lastShotTime <= 0) {
			this.resetShootCooldown();
			this.lastShotTime = this.shootCooldown;

			let angle = Math.PI; // Par défaut vers la gauche
			if (targetX !== undefined && targetY !== undefined) {
				angle = Math.atan2(targetY - (this.y + this.height / 2), targetX - (this.x + this.width / 2));
			}

			if (this.type === 'BUS_RELAY') {
				const pattern: ServerBullet[] = [];
				const numBullets = 5;
				const spread = Math.PI / 3;
				const startAngle = angle - spread / 2;

				for (let i = 0; i < numBullets; i++) {
					const currentAngle = startAngle + (spread / (numBullets - 1)) * i;
					pattern.push(new ServerBullet(
						this.id,
						this.x,
						this.y + this.height / 2,
						6,
						currentAngle,
						15,
						'enemy',
						30,
						30
					));
				}
				return pattern;
			} else {
				return new ServerBullet(
					this.id,
					this.x,
					this.y + this.height / 2,
					7,
					angle,
					10,
					'enemy',
					20,
					20
				);
			}
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
