import type { Socket } from 'socket.io-client';

export default class Game {
	socet: Socket;

	constructor(socket: Socket) {
		// Initialisation du jeu
		this.socet = socket;
	}

	update(): void {
		//appeller par setinterval
	}

	draw(): void {
		//appeller par requestanimationframe
	}
}
