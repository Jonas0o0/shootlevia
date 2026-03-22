import { ServerEnemy } from '../models/ServerEnemy.ts';

export class SpawnEnemyService {
	private baseRespawnRate: number = 300;
	private minRespawnRate: number = 30; //nombre minimum a la quelle les ennemis spawn
	private difficultyCurve: number = 0.1;
	private enemySpawnCooldown: number = 0;

	public calculateRespawnRate(time: number): number {
		return Math.max(
			this.minRespawnRate,
			Math.floor(this.baseRespawnRate - time * this.difficultyCurve),
		);
	}

	public getEnemyType(randomValue: number): 'PNEU' | 'DRONE' {
		return randomValue < 0.3 ? 'PNEU' : 'DRONE';
	}

	public update(time: number, hasPlayers: boolean, enemies: ServerEnemy[]): void {
		if (hasPlayers) {
			this.enemySpawnCooldown--;
			if (this.enemySpawnCooldown <= 0) {
				enemies.push(this.generateEnemy());
				this.enemySpawnCooldown = this.calculateRespawnRate(time);
			}
		} else {
			this.reset();
		}
	}

	public reset(): void {
		this.enemySpawnCooldown = 0;
	}

	private generateEnemy(): ServerEnemy {
		const id = Math.random().toString(36).substring(7);
		const type = this.getEnemyType(Math.random());
		
		let x: number, y: number;
		let vx: number, vy: number;

		if (type === 'PNEU') {
			x = 1920 + Math.random() * 200;
			y = 216 + 50 + Math.random() * (864 - 100);
			vx = -(0.4 * (1000 / 60));
			vy = 0;
		} else {
			const spawnOnTop = Math.random() < 0.5;
			if (spawnOnTop) {
				x = Math.random() * 1920;
				y = -100;
				vx = (Math.random() - 0.5) * 3;
				vy = 2 + Math.random();
			} else {
				x = 2200 + Math.random() * 300; 
				y = Math.random() * 800;
				vx = -(2 + Math.random() * 2);
				vy = (Math.random() - 0.5) * 2;
			}
		}

		return new ServerEnemy(id, type, x, y, vx, vy);
	}
}
