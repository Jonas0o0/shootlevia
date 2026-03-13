import type { Socket } from 'socket.io-client';
import type Player from './Player.ts';
import { Direction } from '../../common/Direction.ts';

export default class Game {
	socet: Socket;
	players: Player[];
	joueur: Player;
	time: number;
	ctx: CanvasRenderingContext2D;

	actions: Record<string, () => void> = {
		Z: () => this.joueur.move(Direction.Up),
		S: () => this.joueur.move(Direction.Down),
		Q: () => this.joueur.move(Direction.Left),
		D: () => this.joueur.move(Direction.Right),
		' ': () => this.joueur.doJump(),
	};

	constructor(
		socket: Socket,
		players: Player[],
		joueur: number,
		ctx: CanvasRenderingContext2D
	) {
		// Initialisation du jeu
		this.socet = socket;
		this.players = players;
		this.joueur = players[joueur];
		this.time = 0;
		this.ctx = ctx;
		window.addEventListener('keypress', (event: KeyboardEvent) => {
			const action = this.actions[event.key.toUpperCase()];
			if (action) {
				action();
				this.socet.emit('move', this);
			}
		});
	}

	update(): void {
		//appeller par setinterval
	}

	draw(): void {
		//appeller par requestanimationframe
	}
}
