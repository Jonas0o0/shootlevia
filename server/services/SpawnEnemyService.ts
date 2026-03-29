import { ServerEnemy } from '../models/ServerEnemy.ts';
import {
	EnemyConfigs,
	type EnemyType,
	type EnemyConfig,
} from '../../common/EnemyType.ts';

export class SpawnEnemyService {
	private baseRespawnRate: number = 300;
	private minRespawnRate: number = 30; // Permet jusqu'à 2 ennemis par seconde
	private difficultyCurve: number = 0.1;
	private enemySpawnCooldown: number = 0;
	private bossSpawned: boolean = false;
	private readonly BOSS_SPAWN_TIME = 1800; // 30 secondes à 60 FPS

	// Coefficients de progression
	private readonly MAX_SPEED_MULTIPLIER: number = 3.0;
	private readonly SPEED_SCALING_FACTOR: number = 0.001;
	private readonly HEALTH_SCALING_FACTOR: number = 0.05;
	private readonly SPAWN_SCALING_FACTOR: number = 0.005;

	constructor(difficultyCurve: number) {
		this.difficultyCurve = difficultyCurve;
	}

	/**
	 * Calcule le facteur de progression global basé sur le temps et la courbe.
	 */
	private getProgression(time: number): number {
		return time * this.difficultyCurve;
	}

	public calculateRespawnRate(time: number): number {
		// Formule non-linéaire : le taux de spawn diminue de plus en plus
		// Plus le SPAWN_SCALING_FACTOR est élevé, plus le nombre d'ennemis explose vite
		const scaledRate =
			this.baseRespawnRate /
			(1 + this.getProgression(time) * this.SPAWN_SCALING_FACTOR);

		return Math.max(this.minRespawnRate, Math.floor(scaledRate));
	}

	private calculateSpeedMultiplier(time: number): number {
		return Math.min(
			this.MAX_SPEED_MULTIPLIER,
			1 + this.getProgression(time) * this.SPEED_SCALING_FACTOR
		);
	}

	private calculateHealth(time: number, type: EnemyType): number {
		const config = EnemyConfigs[type];
		return (
			config.baseHealth +
			Math.floor(this.getProgression(time) * this.HEALTH_SCALING_FACTOR)
		);
	}

	public getEnemyType(randomValue: number): EnemyType {
		let cumulativeProbability = 0;
		const configs = Object.values(EnemyConfigs);

		for (const config of configs) {
			cumulativeProbability += config.spawnProbability;
			if (randomValue < cumulativeProbability) {
				return config.type;
			}
		}

		return configs[configs.length - 1].type;
	}

	public onBossDefeated(): void {
		this.bossSpawned = false;
	}

	public update(
		time: number,
		hasPlayers: boolean,
		enemies: ServerEnemy[]
	): void {
		if (hasPlayers) {
			// On verifie s'il y a un boss en vie
			const isBossAlive = enemies.some(e => e.type === 'BUS_RELAY');

			// Logique de spawn du boss
			if (time > 0 && time % this.BOSS_SPAWN_TIME === 0 && !isBossAlive && !this.bossSpawned) {
				enemies.push(this.generateBoss());
				this.bossSpawned = true;
				return; // On ne spawn rien d'autre sur cette frame
			}

			// Si le boss est là, on arrête le spawn d'ennemis normaux
			if (isBossAlive) {
				return;
			}

			// Sinon on spawn les ennemis normaux
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
		this.bossSpawned = false;
	}

	private generateBoss(): ServerEnemy {
		const id = Math.random().toString(36).substring(7);
		const type: EnemyType = 'BUS_RELAY';
		const config = EnemyConfigs[type];
		
		const x = 1400;
		const y = 300;
		const vx = 0;
		const vy = 2;

		return new ServerEnemy(id, type, x, y, vx, vy, config.baseHealth);
	}

	private generateEnemy(time: number): ServerEnemy {
		const id = Math.random().toString(36).substring(7);

		const configs = Object.values(EnemyConfigs);
		// Somme des probabilités pour un random normalisé
		const totalProb = configs.reduce(
			(sum: number, c: EnemyConfig) => sum + c.spawnProbability,
			0
		);
		const type = this.getEnemyType(Math.random() * totalProb);

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
