import type { EnemyData } from '../../common/types.ts';
import { LifebarService } from '../../common/Service/LifebarService.ts';

export class ServerEnemy {
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
	}

	update(): void {
		this.x += this.vx;
		this.y += this.vy;
		if (this.damageTimer > 0) {
			this.damageTimer--;
		}
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
