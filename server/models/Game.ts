import { ServerPlayer } from './Player.ts';
import type { GameState } from '../../common/types.ts';
import { Direction } from '../../common/Direction.ts';
import { ServerBullet } from './Bullet.ts';
import { ServerEnemy } from './ServerEnemy.ts';

export class ServerGame {
	private players: Map<string, ServerPlayer> = new Map();
	private bullets: ServerBullet[] = [];
	private enemies: ServerEnemy[] = [];
	private enemySpawnTimer: number = 0;
	private time: number = 0;

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
		this.bullets = this.bullets.filter(b => b.x < 2000);

		// Gestion de l'apparition des ennemis
		if (this.time % 60 === 0) {
			this.spawnEnemy();
		}

		this.enemies.forEach(enemy => enemy.update());
		this.enemies = this.enemies.filter(e => e.x > -200 && e.y < 2000);
	}

	private spawnEnemy(): void {
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

		this.enemies.push(new ServerEnemy(id, x, y, vx, vy));
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
