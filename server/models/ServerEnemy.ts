import type { EnemyData } from '../../common/types.ts';

export class ServerEnemy {
	public id: string;
	public x: number;
	public y: number;
	public vx: number;
	public vy: number;
	public width: number;
	public height: number;
	public health: number = 100;

	constructor(id: string, x: number, y: number, vx: number, vy: number) {
		this.id = id;
		this.x = x;
		this.y = y;
		this.vx = vx;
		this.vy = vy;
		this.width = 50;
		this.height = 50;
	}

	update(): void {
		this.x += this.vx;
		this.y += this.vy;
	}

	toData(): EnemyData {
		return {
			id: this.id,
			x: this.x,
			y: this.y,
			width: this.width,
			height: this.height,
			health: this.health,
		};
	}
}
