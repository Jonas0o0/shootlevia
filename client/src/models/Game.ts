import type { Socket } from 'socket.io-client';
import type Player from './Player.ts';
import { Direction } from '../../../common/Direction.ts';

export default class Game {
	private socket: Socket;
	private players: Player[];
	private joueur: Player;
	private time: number;
	private canvas: HTMLCanvasElement;
	private ctx: CanvasRenderingContext2D;
	private keysPressed: Set<string> = new Set();

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

		window.addEventListener('keydown', (event: KeyboardEvent) => {
			this.keysPressed.add(event.key.toUpperCase());
			// Pour le saut, on peut garder une action directe si on veut qu'il ne se déclenche qu'une fois par appui
			if (event.key === ' ') {
				this.joueur.doJump();
			}
		});

		window.addEventListener('keyup', (event: KeyboardEvent) => {
			this.keysPressed.delete(event.key.toUpperCase());
		});
	}

	update(): void {
		// Appelé par setInterval (60fps)
		let moved = false;

		// Mise à jour de l'état du joueur (saut, etc.)
		this.joueur.update();

		if (this.keysPressed.has('Z')) {
			this.joueur.move(Direction.Up);
			moved = true;
		}
		if (this.keysPressed.has('S')) {
			this.joueur.move(Direction.Down);
			moved = true;
		}
		if (this.keysPressed.has('Q')) {
			this.joueur.move(Direction.Left);
			moved = true;
		}
		if (this.keysPressed.has('D')) {
			this.joueur.move(Direction.Right);
			moved = true;
		}

		if (moved) {
			this.socket.emit('move', this);
		}
		this.time;
		this.players;
	}

	draw = (): void => {
		//appeller par requestanimationframe
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.joueur.draw(this.ctx);

		requestAnimationFrame(this.draw);
	};
}
