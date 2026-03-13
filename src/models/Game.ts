import type { Socket } from 'socket.io-client';
import type Player from './Player.ts';
import { Direction } from '../../common/Direction.ts';

export default class Game {
	private socket: Socket;
	private players: Player[];
	private joueur: Player;
	private time: number;
	private canvas: HTMLCanvasElement;
	private ctx: CanvasRenderingContext2D;

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
		canvas: HTMLCanvasElement,
		ctx: CanvasRenderingContext2D
	) {
		// Initialisation du jeu
		this.socket = socket;
		this.players = players;
		this.joueur = players[joueur];
		this.time = 0;
		this.canvas = canvas;
		this.ctx = ctx;
		window.addEventListener('keypress', (event: KeyboardEvent) => {
			const action = this.actions[event.key.toUpperCase()];
			if (action) {
				action();
				this.socket.emit('move', this);
			}
		});
	}

	update(): void {
		//appeller par setinterval
	}

	draw = (): void => {
		//appeller par requestanimationframe
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.joueur.draw(this.ctx);

		requestAnimationFrame(this.draw);
	};
}
