import type { Socket } from 'socket.io-client';
import Player from './Player.ts';
import { Direction } from '../../../common/Direction.ts';
import type { GameState } from '../../../common/types.ts';

export default class Game {
	private socket: Socket;
	private players: Map<string, Player> = new Map();
	private joueur: Player;
	private time: number;
	private canvas: HTMLCanvasElement;
	private ctx: CanvasRenderingContext2D;
	private keysPressed: Set<string> = new Set();

	constructor(
		socket: Socket,
		players: Player[],
		joueurIdx: number,
		canvas: HTMLCanvasElement,
		ctx: CanvasRenderingContext2D
	) {
		// Initialisation du jeu
		this.socket = socket;
		this.time = 0;
		this.canvas = canvas;
		this.ctx = ctx;

		// Initialisation du joueur local
		this.joueur = players[joueurIdx];
		this.joueur.id = socket.id || '';
		this.players.set(this.joueur.id, this.joueur);

		// Rejoindre la partie côté serveur
		this.socket.emit('join', {
			username: this.joueur.getAccoutn().username,
			avatar: this.joueur.getAccoutn().avatar,
		});

		window.addEventListener('keydown', (event: KeyboardEvent) => {
			const key = event.key.toUpperCase();
			this.keysPressed.add(key);

			if (key === ' ') {
				this.socket.emit('jump');
			}
		});

		window.addEventListener('keyup', (event: KeyboardEvent) => {
			this.keysPressed.delete(event.key.toUpperCase());
		});

		// Synchronisation avec le serveur
		this.socket.on('gameState', (state: GameState) => {
			this.time = state.time;
			state.players.forEach(playerData => {
				let p = this.players.get(playerData.id);
				if (!p) {
					// Nouveau joueur connecté
					p = new Player(playerData.account, playerData.x, playerData.y);
					p.id = playerData.id;
					this.players.set(p.id, p);
				}
				p.updateFromData(playerData);
			});

			// Supprimer les joueurs qui ont quitté
			const currentIds = state.players.map(p => p.id);
			for (const id of this.players.keys()) {
				if (!currentIds.includes(id)) {
					this.players.delete(id);
				}
			}
		});
	}

	update(): void {
		// Appelé par setInterval (60fps)
		const directions: Direction[] = [];

		if (this.keysPressed.has('Z')) directions.push(Direction.Up);
		if (this.keysPressed.has('S')) directions.push(Direction.Down);
		if (this.keysPressed.has('Q')) directions.push(Direction.Left);
		if (this.keysPressed.has('D')) directions.push(Direction.Right);

		if (directions.length > 0) {
			this.socket.emit('move', directions);
		}

		this.time;
	}

	draw = (): void => {
		//appeller par requestanimationframe
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		// Dessiner tous les joueurs
		this.players.forEach(player => {
			player.draw(this.ctx);
		});

		requestAnimationFrame(this.draw);
	};
}
