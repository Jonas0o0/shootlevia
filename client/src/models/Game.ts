import type { Socket } from 'socket.io-client';
import Player from './Player.ts';
import Bullet from './Bullet.ts';
import Enemy from './Enemy.ts';
import type { GameState } from '../../../common/types.ts';
import type { GameStats } from '../types.ts';
import GameMap from './GameMap.ts';
import Bonus from './Bonus.ts';
import { DeplacementType } from './DeplacementType.ts';
import type { Difficulty } from '../../../common/Difficulty.ts';

export default class Game {
	private socket: Socket;
	private players: Map<string, Player> = new Map();
	private bullets: Map<string, Bullet> = new Map();
	private enemies: Map<string, Enemy> = new Map();
	private bonuses: Map<string, Bonus> = new Map();
	private readonly joueur: Player;
	private time: number;
	private score: number;
	private enemyCount: number;
	private canvas: HTMLCanvasElement;
	private ctx: CanvasRenderingContext2D;
	private keysPressed: Set<string> = new Set();
	private mousePosition: { x: number; y: number } | null = null;
	private map: GameMap;
	private souris: boolean;
	private active: boolean = true;
	private onGameOver: (stats: GameStats) => void;
	private intervalId: number | null = null;
	private keydownHandler?: (event: KeyboardEvent) => void;
	private keyupHandler?: (event: KeyboardEvent) => void;
	private mousemoveHandler?: (event: MouseEvent) => void;
	private mousedownHandler?: (event: MouseEvent) => void;
	private mouseoutHandler?: () => void;
	private readonly difficulty: Difficulty;
	private currentVelocityX: number = 0;
	private currentVelocityY: number = 0;
	private readonly ACCELERATION: number = 0.5;
	private readonly FRICTION: number = 0.85;
	private readonly MAX_SPEED: number = 5;

	constructor(
		socket: Socket,
		players: Player[],
		joueurIdx: number,
		canvas: HTMLCanvasElement,
		ctx: CanvasRenderingContext2D,
		difficulty: Difficulty,
		onGameOver: (stats: GameStats) => void
	) {
		// Initialisation du jeu
		this.socket = socket;
		this.onGameOver = onGameOver;
		this.time = 0;
		this.score = 0;
		this.enemyCount = 0;
		this.canvas = canvas;
		this.ctx = ctx;
		this.difficulty = difficulty;
		//Initialisation de la map
		this.map = new GameMap();

		// Initialisation du joueur local
		this.joueur = players[joueurIdx];
		this.joueur.id = socket.id || '';
		this.players.set(this.joueur.id, this.joueur);

		this.souris =
			this.joueur.getAccoutn().deplacement === DeplacementType.Mouse;

		// Rejoindre la partie côté serveur avec la taille du canvas
		this.socket.emit('join', {
			username: this.joueur.getAccoutn().username,
			avatar: this.joueur.getAccoutn().avatar,
			canvasWidth: this.canvas.width,
			canvasHeight: this.canvas.height,
			difficulty: this.difficulty,
		});

		if (!this.souris) {
			this.keydownHandler = (event: KeyboardEvent) => {
				const key = event.key.toUpperCase();
				this.keysPressed.add(key);

				if (key === ' ') {
					this.socket.emit('jump');
				}
			};
			window.addEventListener('keydown', this.keydownHandler);

			this.keyupHandler = (event: KeyboardEvent) => {
				this.keysPressed.delete(event.key.toUpperCase());
			};
			window.addEventListener('keyup', this.keyupHandler);
		} else {
			this.mousemoveHandler = (event: MouseEvent) => {
				const rect = this.canvas.getBoundingClientRect();
				// Map mouse coordinates to internal 1920x1080 resolution
				const scaleX = this.canvas.width / rect.width;
				const scaleY = this.canvas.height / rect.height;
				this.mousePosition = {
					x: (event.clientX - rect.left) * scaleX,
					y: (event.clientY - rect.top) * scaleY,
				};
			};
			window.addEventListener('mousemove', this.mousemoveHandler);

			this.mousedownHandler = (event: MouseEvent) => {
				if (event.button === 0) {
					event.preventDefault();
					this.socket.emit('jump');
				}
			};
			this.canvas.addEventListener('mousedown', this.mousedownHandler);

			this.mouseoutHandler = () => {
				this.mousePosition = null;
			};
			window.addEventListener('mouseout', this.mouseoutHandler);
		}
		// Synchronisation avec le serveur
		this.socket.on('gameState', (state: GameState) => {
			//temps
			this.time = state.time;
			//score
			this.score = state.score || 0;
			const scoreElement = document.getElementById('game-score');
			if (scoreElement) {
				scoreElement.textContent = this.score.toString();
			}
			//ennemis total tués
			this.enemyCount = state.enemyCount || 0;
			const enemyCountElement = document.getElementById('nb-enemy-count');
			if (enemyCountElement) {
				enemyCountElement.textContent = this.enemyCount.toString();
			}

			state.players.forEach(playerData => {
				let p = this.players.get(playerData.id);

				if (!p && playerData.id === this.socket.id) {
					for (const [key, val] of this.players.entries()) {
						if (val === this.joueur) {
							this.players.delete(key);
							break;
						}
					}
					p = this.joueur;
					p.id = playerData.id;
					this.players.set(p.id, p);
					console.log('[CLIENT] Local player re-bound to ID:', p.id);
				}

				if (!p) {
					// Nouveau joueur connecté
					p = new Player(playerData.account, playerData.x, playerData.y);
					p.id = playerData.id;
					this.players.set(p.id, p);
				}
				p.updateFromData(playerData);
			});

			// verif si tous les joueurs sont morts
			const allPlayers = Array.from(this.players.values());
			const livingPlayers = allPlayers.filter(
				p => !!p.getLife() && p.getLife().isAlive()
			);
			if (allPlayers.length > 0 && livingPlayers.length === 0 && this.active) {
				this.stop();
				const leaderboard = state.players
					.map(p => ({
						username: p.account.username,
						score: p.score || 0,
					}))
					.sort((a, b) => b.score - a.score);

				this.onGameOver({
					time: this.time,
					score: this.score,
					enemyCount: this.enemyCount,
					leaderboard: leaderboard,
				});
				return;
			}

			if (!this.joueur.getLife().isAlive() && this.active) {
				// Individual player dead, but game continues (spectator) unless caught by above check
			}

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

	start(): void {
		if (this.intervalId) return;
		this.intervalId = setInterval(
			() => this.update(),
			1000 / 60
		) as unknown as number;
		this.draw();
	}

	stop(): void {
		this.active = false;
		if (this.intervalId) {
			clearInterval(this.intervalId);
			this.intervalId = null;
		}
		if (this.keydownHandler)
			window.removeEventListener('keydown', this.keydownHandler);
		if (this.keyupHandler)
			window.removeEventListener('keyup', this.keyupHandler);
		if (this.mousemoveHandler)
			window.removeEventListener('mousemove', this.mousemoveHandler);
		if (this.mousedownHandler)
			this.canvas.removeEventListener('mousedown', this.mousedownHandler);
		if (this.mouseoutHandler)
			window.removeEventListener('mouseout', this.mouseoutHandler);
	}

	update(): void {
		if (!this.active) return;

		// pas d'input quand mode spectateur
		if (!this.joueur.getLife().isAlive()) {
			this.currentVelocityX = 0;
			this.currentVelocityY = 0;
			return;
		}

		let targetVx = 0;
		let targetVy = 0;

		if (!this.souris) {
			// Mode Clavier : Calcul de la direction cible
			if (this.keysPressed.has('Z')) targetVy -= 1;
			if (this.keysPressed.has('S')) targetVy += 1;
			if (this.keysPressed.has('Q')) targetVx -= 1;
			if (this.keysPressed.has('D')) targetVx += 1;

			// Normalisation pour les diagonales
			if (targetVx !== 0 && targetVy !== 0) {
				const length = Math.sqrt(targetVx * targetVx + targetVy * targetVy);
				targetVx /= length;
				targetVy /= length;
			}

			targetVx *= this.MAX_SPEED;
			targetVy *= this.MAX_SPEED;

			// Application de l'accélération (Inertie)
			if (targetVx !== 0) {
				this.currentVelocityX +=
					(targetVx - this.currentVelocityX) * this.ACCELERATION;
			} else {
				this.currentVelocityX *= this.FRICTION;
			}

			if (targetVy !== 0) {
				this.currentVelocityY +=
					(targetVy - this.currentVelocityY) * this.ACCELERATION;
			} else {
				this.currentVelocityY *= this.FRICTION;
			}
		} else {
			// Mode Souris : 360° et Vitesse proportionnelle
			if (this.mousePosition) {
				const playerPos = this.joueur.getPostition();
				const playerCenterX = playerPos.x + playerPos.width / 2;
				const playerCenterY = playerPos.y + playerPos.height / 2;

				const dx = this.mousePosition.x - playerCenterX;
				const dy = this.mousePosition.y - playerCenterY;
				const distance = Math.sqrt(dx * dx + dy * dy);

				const threshold = 10;
				if (distance > threshold) {
					// Vitesse proportionnelle à la distance (max à 200px)
					const speed = Math.min(this.MAX_SPEED, (distance - threshold) / 20);
					this.currentVelocityX = (dx / distance) * speed;
					this.currentVelocityY = (dy / distance) * speed;
				} else {
					this.currentVelocityX *= this.FRICTION;
					this.currentVelocityY *= this.FRICTION;
				}
			} else {
				this.currentVelocityX *= this.FRICTION;
				this.currentVelocityY *= this.FRICTION;
			}
		}

		// Arrêt complet si très lent
		if (Math.abs(this.currentVelocityX) < 0.1) this.currentVelocityX = 0;
		if (Math.abs(this.currentVelocityY) < 0.1) this.currentVelocityY = 0;

		// Envoi au serveur si mouvement
		if (this.currentVelocityX !== 0 || this.currentVelocityY !== 0) {
			this.socket.emit('move', {
				x: this.currentVelocityX,
				y: this.currentVelocityY,
			});
		}
	}

	draw = (): void => {
		if (!this.active) return;
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

		// afficher spectateur quand le joueur est mort
		if (!this.joueur.getLife().isAlive()) {
			this.ctx.save();
			this.ctx.fillStyle = 'white';
			this.ctx.font = '48px "Pixelify Sans"';
			this.ctx.textAlign = 'center';
			this.ctx.fillText(
				'SPECTATEUR',
				this.canvas.width / 2,
				this.canvas.height - 50
			);
			this.ctx.restore();
		}

		requestAnimationFrame(this.draw);
	};
}
