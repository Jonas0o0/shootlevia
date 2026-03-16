import { ServerPlayer } from './Player.ts';
import type { GameState } from '../../common/types.ts';
import { Direction } from '../../common/Direction.ts';
import { ServerBullet } from './Bullet.ts';
import { ServerEnemy } from './ServerEnemy.ts';
import { SpawnEnemyService } from '../services/SpawnEnemyService.ts';

export class ServerGame {
	private players: Map<string, ServerPlayer> = new Map();
	private bullets: ServerBullet[] = [];
	private enemies: ServerEnemy[] = [];
	private time: number = 0;

	private spawnEnemyService: SpawnEnemyService = new SpawnEnemyService();

	constructor() {
		// Boucle de jeu (60fps)
		setInterval(() => this.update(), 1000 / 60);
	}

	addPlayer(id: string, username: string, avatar: string): void {
		const x = 100; // Position de départ par défaut
		const y = 300;
		this.players.set(id, new ServerPlayer(id, { username, avatar }, x, y));
	}

	removePlayer(id: string): void {
		this.players.delete(id);
	}

	handlePlayerMove(id: string, directions: Direction[]): void {
		const player = this.players.get(id);
		if (player) {
			directions.forEach(dir => player.move(dir));
		}
	}

	handlePlayerJump(id: string): void {
		const player = this.players.get(id);
		if (player) {
			player.doJump();
		}
	}

	handlePlayerShoot(id: string): void {
		const player = this.players.get(id);
		if (player) {
			const bullet = new ServerBullet(id, player.x + player.width, player.y + player.height / 2);
			this.bullets.push(bullet);
		}
	}

	update(): void {
		this.time++;
		this.players.forEach(player => player.update());
		this.bullets.forEach(bullet => bullet.update());

		// Détruire des drones avec les balles
		const bulletsToRemove = new Set<string>();
		const enemiesToRemove = new Set<string>();

		this.bullets.forEach(bullet => {
			this.enemies.forEach(enemy => {
				if (
					bullet.x < enemy.x + enemy.width &&
					bullet.x + bullet.width > enemy.x &&
					bullet.y < enemy.y + enemy.height &&
					bullet.y + bullet.height > enemy.y
				) {
					if (enemy.type === 'DRONE') {
						enemy.health -= 100;
						bulletsToRemove.add(bullet.id);
						if (enemy.health <= 0) {
							enemiesToRemove.add(enemy.id);
						}
					}
				}
			});
		});

		this.bullets = this.bullets.filter(b => !bulletsToRemove.has(b.id) && b.x < 2000);

		if (this.players.size > 0) {
			this.spawnEnemyService.update(this.time, true, this.enemies);
		} else if (this.time > 0) {
			this.time = 0;
			this.enemies = [];
			this.spawnEnemyService.reset();
		}

		this.enemies.forEach(enemy => enemy.update());
		this.enemies = this.enemies.filter(e => !enemiesToRemove.has(e.id) && e.x > -200 && e.y < 2000);
	}

	getState(): GameState {
		return {
			players: Array.from(this.players.values()).map(p => p.toData()),
			bullets: this.bullets.map(b => b.toData()),
			enemies: this.enemies.map(e => e.toData()),
			time: this.time,
		};
	}
}
