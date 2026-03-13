import type { Socket } from 'socket.io-client';
import type Player from './Player.ts';
import { Direction } from '../../common/Direction.ts';

export default class Game {
	socet: Socket;
	players: Player[];
	joueur: Player;

	constructor(socket: Socket, players: Player[], joueur: number) {
		// Initialisation du jeu
		this.socet = socket;
		this.players = players;
		this.joueur = players[joueur];
		window.addEventListener('keypress', (event: KeyboardEvent) => {
			switch (event.key.toUpperCase()) {
				case 'Z':
					this.joueur.move(Direction.Up);
					break;
				case 'S':
					this.joueur.move(Direction.Down);
					break;
				case 'Q':
					this.joueur.move(Direction.Left);
					break;
				case 'D':
					this.joueur.move(Direction.Right);
					break;
				case 'SPACE':
					this.joueur.doJump();
					break;
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
