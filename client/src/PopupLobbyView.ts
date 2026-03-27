import View from './View.ts';
import type { Socket } from 'socket.io-client';
import Router from './Router.ts';
import { Difficulty } from '../../common/Difficulty.ts';

export default class PopupLobbyView extends View {
	popUpName: HTMLElement;
	createBtn: HTMLButtonElement;
	joinBtn: HTMLButtonElement;
	codeInput: HTMLInputElement;
	closeBtn: HTMLButtonElement;
	startGameBtn: HTMLButtonElement;
	menuDiv: HTMLElement;
	roomDiv: HTMLElement;
	codeDisplay: HTMLElement;
	playersList: HTMLElement;
	waitingMessage: HTMLElement;
	difficulty: HTMLElement;
	private socket: Socket;
	private solo: boolean = false;

	constructor(element: HTMLElement, socket: Socket) {
		super(element);
		this.socket = socket;

		this.popUpName = element.querySelector('#lobbypopup h2')!;
		this.createBtn = element.querySelector('#createLobbyBtn')!;
		this.joinBtn = element.querySelector('#joinLobbyBtn')!;
		this.codeInput = element.querySelector('#lobbyCodeInput')!;
		this.closeBtn = element.querySelector('#closeLobbyBtn')!;
		this.startGameBtn = element.querySelector('#startGameBtn')!;
		this.menuDiv = element.querySelector('#lobby-menu')!;
		this.roomDiv = element.querySelector('#lobby-room')!;
		this.codeDisplay = element.querySelector('#lobbyCodeDisplay')!;
		this.playersList = element.querySelector('#lobbyPlayerList')!;
		this.waitingMessage = element.querySelector('#waitingMessage')!;
		this.difficulty = element.querySelector('.difficulty-choice')!;

		this.setupListeners();
		this.setupSocketListeners();
	}

	public getDifficulty(): Difficulty {
		const formData = new FormData(this.difficulty as HTMLFormElement);
		const diffValue = formData.get('difficulty');
		switch (diffValue) {
			case 'moyen':
				return Difficulty.Moyen;
			case 'difficile':
				return Difficulty.Difficile;
			case 'facile':
			default:
				return Difficulty.Facile;
		}
	}

	private setupListeners() {
		this.createBtn.addEventListener('click', () => {
			this.socket.emit('create_lobby', this.getDifficulty());
		});

		this.joinBtn.addEventListener('click', () => {
			const code = this.codeInput.value.trim();
			if (code) {
				this.socket.emit('join_lobby', code);
			}
		});

		this.closeBtn.addEventListener('click', () => {
			this.hide();
		});

		this.startGameBtn.addEventListener('click', () => {
			if (this.solo) {
				this.hide();
				Router.navigate('/play');
			} else {
				this.socket.emit('start_match');
			}
		});
	}

	private setupSocketListeners() {
		this.socket.on('lobby_created', (code: string) => {
			this.showRoom(code, true);
		});

		this.socket.on(
			'lobby_joined',
			(data: { success: boolean; roomId?: string; error?: string }) => {
				if (data.success && data.roomId) {
					this.showRoom(data.roomId, false);
				} else {
					alert(data.error || 'Erreur lors de la connexion au lobby');
				}
			}
		);

		this.socket.on('lobby_update', (data: { count: number }) => {
			this.updatePlayersList(data.count);
		});

		this.socket.on('match_started', () => {
			this.hide();
			Router.navigate('/play');
		});
	}

	private showRoom(code: string, isHost: boolean) {
		this.menuDiv.style.display = 'none';
		this.roomDiv.style.display = 'block';
		this.codeDisplay.textContent = code;
		this.codeDisplay.parentElement!.style.display = this.solo ? 'none' : 'block';

		if (isHost) {
			this.startGameBtn.style.display = 'inline-block';
			this.waitingMessage.style.display = 'none';
			this.difficulty.style.display = 'block';
		} else {
			this.startGameBtn.style.display = 'none';
			this.waitingMessage.style.display = 'block';
			this.difficulty.style.display = 'none';
		}
	}

	private updatePlayersList(count: number) {
		this.playersList.innerHTML = '';
		const li = document.createElement('li');
		li.textContent = `${count} Joueur(s) dans le salon`;
		this.playersList.appendChild(li);
	}

	show(solo: boolean = false) {
		super.show();
		this.solo = solo;
		if (solo) {
			this.popUpName.innerHTML = 'Partie Solo';
			this.socket.emit('create_lobby', this.getDifficulty());
		} else {
			this.popUpName.innerHTML = 'Partie Multijoueur';
			this.menuDiv.style.display = 'block';
			this.roomDiv.style.display = 'none';
			this.element.classList.add('active');
			this.codeDisplay.parentElement!.style.display = 'block';
			this.playersList.style.display = 'block';
		}
	}

	hide() {
		super.hide();
		this.element.classList.remove('active');
	}
}
