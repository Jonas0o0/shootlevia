import { ServerEnemy } from '../models/ServerEnemy.ts';

export class SpawnEnemyService {
	private baseRespawnRate: number = 300;
	private minRespawnRate: number = 30; //nombre minimum a la quelle les ennemis spawn
	private difficultyCurve: number = 0.01;
	private enemySpawnCooldown: number = 0;

	public update(time: number, hasPlayers: boolean, enemies: ServerEnemy[]): void {
		if (hasPlayers) {
			this.enemySpawnCooldown--;
			if (this.enemySpawnCooldown <= 0) {
				enemies.push(this.generateEnemy());
				
				const currentRespawnRate = Math.max(
					this.minRespawnRate, 
					Math.floor(this.baseRespawnRate - (time * this.difficultyCurve))
				);
				this.enemySpawnCooldown = currentRespawnRate;
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
		const spawnOnTop = Math.random() < 0.5;
		let x: number, y: number;
		let vx: number, vy: number;

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

		return new ServerEnemy(id, x, y, vx, vy);
	}
}
