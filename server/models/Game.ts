import { ServerPlayer } from './Player.ts';
import type { GameState } from '../../common/types.ts';
import { Direction } from '../../common/Direction.ts';
import { ServerBullet } from './Bullet.ts';

export class ServerGame {
	private players: Map<string, ServerPlayer> = new Map();
	private bullets: ServerBullet[] = [];
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
		// afficher les balles le temps qu'elles ne sont pas trop loins
		this.bullets = this.bullets.filter(b => b.x < 2000);
	}

	getState(): GameState {
		return {
			players: Array.from(this.players.values()).map(p => p.toData()),
			bullets: this.bullets.map(b => b.toData()),
			time: this.time,
		};
	}
}
