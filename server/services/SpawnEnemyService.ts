import { ServerEnemy } from '../models/ServerEnemy.ts';

export class SpawnEnemyService {
	private baseRespawnRate: number = 300;
	private minRespawnRate: number = 30;
	private difficultyCurve: number = 0.1;
	private enemySpawnCooldown: number = 0;

	// Coefficients de progression (ajustés pour difficultyCurve entre 0.3 et 0.5)
	private readonly BASE_DRONE_HEALTH: number = 30;
	private readonly BASE_PNEU_HEALTH: number = 160;
	private readonly MAX_SPEED_MULTIPLIER: number = 3.0;

	// Ces facteurs sont multipliés par (time * difficultyCurve)
	// Ils permettent de doser l'impact de la courbe sur chaque statistique
	private readonly SPEED_SCALING_FACTOR: number = 0.001;
	private readonly HEALTH_SCALING_FACTOR: number = 0.05;

	constructor(difficultyCurve: number) {
		this.difficultyCurve = difficultyCurve;
	}

	/**
	 * Calcule le facteur de progression global basé sur le temps et la courbe.
	 * Tout le scaling du jeu dépend de ce facteur unique.
	 */
	private getProgression(time: number): number {
		return time * this.difficultyCurve;
	}

	public calculateRespawnRate(time: number): number {
		// Le spawn rate suit la courbe linéairement
		return Math.max(
			this.minRespawnRate,
			Math.floor(this.baseRespawnRate - this.getProgression(time))
		);
	}

	private calculateSpeedMultiplier(time: number): number {
		return Math.min(
			this.MAX_SPEED_MULTIPLIER,
			1 + this.getProgression(time) * this.SPEED_SCALING_FACTOR
		);
	}

	private calculateHealth(time: number, type: 'PNEU' | 'DRONE'): number {
		const baseHealth =
			type === 'PNEU' ? this.BASE_PNEU_HEALTH : this.BASE_DRONE_HEALTH;
		return (
			baseHealth +
			Math.floor(this.getProgression(time) * this.HEALTH_SCALING_FACTOR)
		);
	}

	public getEnemyType(randomValue: number): 'PNEU' | 'DRONE' {
		return randomValue < 0.3 ? 'PNEU' : 'DRONE';
	}

	public update(
		time: number,
		hasPlayers: boolean,
		enemies: ServerEnemy[]
	): void {
		if (hasPlayers) {
			this.enemySpawnCooldown--;
			if (this.enemySpawnCooldown <= 0) {
				enemies.push(this.generateEnemy(time));
				this.enemySpawnCooldown = this.calculateRespawnRate(time);
			}
		} else {
			this.reset();
		}
	}

	public reset(): void {
		this.enemySpawnCooldown = 0;
	}

	private generateEnemy(time: number): ServerEnemy {
		const id = Math.random().toString(36).substring(7);
		const type = this.getEnemyType(Math.random());
		const speedMult = this.calculateSpeedMultiplier(time);
		const health = this.calculateHealth(time, type);

		let x: number, y: number;
		let vx: number, vy: number;

		if (type === 'PNEU') {
			x = 1920 + Math.random() * 200;
			y = 216 + 50 + Math.random() * (864 - 100);
			vx = -(0.4 * (1000 / 60)) * speedMult;
			vy = 0;
		} else {
			const spawnOnTop = Math.random() < 0.5;
			if (spawnOnTop) {
				x = Math.random() * 1920;
				y = -100;
				vx = (Math.random() - 0.5) * 3 * speedMult;
				vy = (2 + Math.random()) * speedMult;
			} else {
				x = 2200 + Math.random() * 300;
				y = Math.random() * 800;
				vx = -(2 + Math.random() * 2) * speedMult;
				vy = (Math.random() - 0.5) * 2 * speedMult;
			}
		}

		return new ServerEnemy(id, type, x, y, vx, vy, health);
	}
}
