import type { Socket } from 'socket.io-client';
import Player from './Player.ts';
import Bullet from './Bullet.ts';
import Enemy from './Enemy.ts';
import { Direction } from '../../../common/Direction.ts';
import type { GameState } from '../../../common/types.ts';
import GameMap from './GameMap.ts';
import Bonus from './Bonus.ts';
import { DeplacementType } from './DeplacementType.ts';

export default class Game {
	private socket: Socket;
	private players: Map<string, Player> = new Map();
	private bullets: Map<string, Bullet> = new Map();
	private enemies: Map<string, Enemy> = new Map();
	private bonuses: Map<string, Bonus> = new Map();
	private joueur: Player;
	private time: number;
	private score: number;
	private canvas: HTMLCanvasElement;
	private ctx: CanvasRenderingContext2D;
	private keysPressed: Set<string> = new Set();
	private mousePosition: { x: number; y: number } | null = null;
	private map: GameMap;
	private souris: boolean;

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
		this.score = 0;
		this.canvas = canvas;
		this.ctx = ctx;

		//Iitialisation de la map
		this.map = new GameMap();

		// Initialisation du joueur local
		this.joueur = players[joueurIdx];
		this.joueur.id = socket.id || '';
		this.players.set(this.joueur.id, this.joueur);

		this.souris =
			this.joueur.getAccoutn().deplacement === DeplacementType.Mouse;

		// tire auto 500ms
		setInterval(() => {
			this.socket.emit('shoot');
		}, 500);

		// Rejoindre la partie côté serveur avec la taille du canvas
		this.socket.emit('join', {
			username: this.joueur.getAccoutn().username,
			avatar: this.joueur.getAccoutn().avatar,
			canvasWidth: this.canvas.width,
			canvasHeight: this.canvas.height
		});

		if (!this.souris) {
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
		} else {
			window.addEventListener('mousemove', (event: MouseEvent) => {
				const rect = this.canvas.getBoundingClientRect();
				this.mousePosition = {
					x: event.clientX - rect.left,
					y: event.clientY - rect.top,
				};
			});

			window.addEventListener('mouseout', () => {
				this.mousePosition = null;
			});
		}
		// Synchronisation avec le serveur
		this.socket.on('gameState', (state: GameState) => {
			this.time = state.time;
			this.score = state.score || 0;
			const scoreElement = document.getElementById('game-score');
			if (scoreElement) {
				scoreElement.textContent = this.score.toString();
			}
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

			// Synchronisation des balles
			state.bullets.forEach(bulletData => {
				let b = this.bullets.get(bulletData.id);
				if (!b) {
					b = new Bullet(bulletData);
					this.bullets.set(b.id, b);
				}
				b.updateFromData(bulletData);
			});

			// Supprimer les balles disparues
			const currentBulletIds = state.bullets.map(b => b.id);
			for (const id of this.bullets.keys()) {
				if (!currentBulletIds.includes(id)) {
					this.bullets.delete(id);
				}
			}

			// Synchronisation des ennemis
			state.enemies.forEach(enemyData => {
				let e = this.enemies.get(enemyData.id);
				if (!e) {
					e = new Enemy(enemyData);
					this.enemies.set(e.id, e);
				}
				e.updateFromData(enemyData);
			});

			// Supprimer les ennemis disparus (avec animation de mort)
			const currentEnemyIds = state.enemies.map(e => e.id);
			for (const [id, enemy] of this.enemies.entries()) {
				if (!currentEnemyIds.includes(id)) {
					enemy.die();
					if (enemy.readyToRemove) {
						this.enemies.delete(id);
					}
				}
			}

			// Synchronisation des bonus
			state.bonuses.forEach(bonusData => {
				let b = this.bonuses.get(bonusData.id);
				if (!b) {
					b = new Bonus(bonusData);
					this.bonuses.set(b.id, b);
				}
				b.updateFromData(bonusData);
			});

			// Supprimer les bonus disparus
			const currentBonusIds = state.bonuses.map(b => b.id);
			for (const id of this.bonuses.keys()) {
				if (!currentBonusIds.includes(id)) {
					this.bonuses.delete(id);
				}
			}
		});
	}

	update(): void {
		// Appelé par setInterval (60fps)
		const directionsSet: Set<Direction> = new Set();

		if (this.keysPressed.has('Z')) directionsSet.add(Direction.Up);
		if (this.keysPressed.has('S')) directionsSet.add(Direction.Down);
		if (this.keysPressed.has('Q')) directionsSet.add(Direction.Left);
		if (this.keysPressed.has('D')) directionsSet.add(Direction.Right);

		if (this.mousePosition) {
			const playerPos = this.joueur.getPostition();
			const playerCenterX = playerPos.x + playerPos.width / 2;
			const playerCenterY = playerPos.y + playerPos.height / 2;

			const threshold = 20; //pour éviter le jitter

			if (this.mousePosition.x < playerCenterX - threshold)
				directionsSet.add(Direction.Left);
			if (this.mousePosition.x > playerCenterX + threshold)
				directionsSet.add(Direction.Right);
			if (this.mousePosition.y < playerCenterY - threshold)
				directionsSet.add(Direction.Up);
			if (this.mousePosition.y > playerCenterY + threshold)
				directionsSet.add(Direction.Down);
		}

		if (directionsSet.size > 0) {
			this.socket.emit('move', Array.from(directionsSet));
		}
		this.score;
		this.time;
	}

	draw = (): void => {
		//appeller par requestanimationframe
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		//Dessiner la map
		this.map.draw(this.canvas, this.ctx);

		// Dessiner toutes les balles
		this.bullets.forEach(bullet => {
			bullet.draw(this.ctx);
		});

		// Dessiner tous les ennemis
		this.enemies.forEach(enemy => {
			enemy.draw(this.ctx);
		});

		// Dessiner tous les bonus
		this.bonuses.forEach(bonus => {
			bonus.drawOnMap(this.ctx);
		});

		// Dessiner tous les joueurs
		this.players.forEach(player => {
			player.draw(this.ctx);
		});

		requestAnimationFrame(this.draw);
	};
}
