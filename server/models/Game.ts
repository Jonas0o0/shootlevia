import { ServerPlayer } from './Player';
import type { GameState } from '../../common/types';
import { Direction } from '../../common/Direction';

export class ServerGame {
	private players: Map<string, ServerPlayer> = new Map();
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

	update(): void {
		this.time++;
		this.players.forEach(player => player.update());
	}

	getState(): GameState {
		return {
			players: Array.from(this.players.values()).map(p => p.toData()),
			time: this.time,
		};
	}
}
