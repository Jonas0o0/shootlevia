import { ServerPlayer } from './Player.ts';
import type { GameState } from '../../common/types.ts';
import { Direction } from '../../common/Direction.ts';
import { ServerEnemy } from './ServerEnemy.ts';
import { SpawnEnemyService } from '../services/SpawnEnemyService.ts';
import ServerBonus from './Bonus.ts';
import { BonusType } from '../../common/BonusType.ts';
import { checkCollision, getCenter, getOverlap } from '../../common/HitBox.ts';
import { Server } from 'socket.io';
import type { Difficulty } from '../../common/Difficulty.ts';
import { leaderboardService } from '../services/LeaderboardService.ts';
import { EnemyConfigs, type EnemyType } from '../../common/EnemyType.ts';
import { ServerBullet } from './Bullet.ts';

export class ServerGame {
	private players: Map<string, ServerPlayer> = new Map();
	private enemies: ServerEnemy[] = [];
	private bonuses: ServerBonus[] = [];
	private enemyBullets: ServerBullet[] = [];
	private time: number = 0;
	private score: number = 0;
	private enemyCount: number = 0;
	private countDrone: number = 0;
	private countPneu: number = 0;
	private difficulty: Difficulty;

	private spawnEnemyService: SpawnEnemyService;
	private intervalId: NodeJS.Timeout;
	private io: Server;
	private roomId: string;

	constructor(io: Server, roomId: string, difficulty: Difficulty) {
		this.io = io;
		this.roomId = roomId;
		this.difficulty = difficulty;
		this.spawnEnemyService = new SpawnEnemyService(
			this.difficulty.difficultyCurve
		);
		// Boucle de jeu (60fps)
		this.intervalId = setInterval(() => this.update(), 1000 / 60);
	}

	stop() {
		clearInterval(this.intervalId);
	}

	reset(): void {
		console.log('reset la partie est cense fonctionne');
		this.players.forEach(p => p.reset());
		this.enemies = [];
		this.bonuses = [];
		this.enemyBullets = [];
		this.time = 0;
		this.score = 0;
		this.enemyCount = 0;
		this.countDrone = 0;
		this.countPneu = 0;
		this.spawnEnemyService = new SpawnEnemyService(
			this.difficulty.difficultyCurve
		);
	}

	addPlayer(
		id: string,
		username: string,
		avatar: string
	): void {
		const x = 100; // Position de départ par défaut
		const y = 300;
		this.players.set(
			id,
			new ServerPlayer(
				id,
				{ username, avatar },
				x,
				y,
				this.difficulty.life
			)
		);
	}

	removePlayer(id: string): void {
		this.players.delete(id);
	}

	handlePlayerMove(id: string, directions: Direction[]): void {
		const player = this.players.get(id);
		if (player && (player.isAlive() || player.isGhost)) {
			directions.forEach(dir => player.move(dir));
		}
	}

	handlePlayerMoveVector(id: string, vx: number, vy: number): void {
		const player = this.players.get(id);
		if (player && (player.isAlive() || player.isGhost)) {
			player.moveByVector(vx, vy);
		}
	}

	handlePlayerJump(id: string): void {
		const player = this.players.get(id);
		if (player && (player.isAlive() || player.isGhost)) {
			player.doJump();
		}
	}

	handlePlayerShoot(id: string): void {
		const player = this.players.get(id);
		if (player && player.isAlive() && !player.isGhost) {
			player.shoot();
		}
	}

	addBonus(type: BonusType, x: number, y: number): void {
		const id = crypto.randomUUID();
		this.bonuses.push(new ServerBonus(id, type, x, y));
	}

	private dropRandomBonus(x: number, y: number): void {
		const allBonusTypes = Object.values(BonusType);
		const randomIndex = Math.floor(Math.random() * allBonusTypes.length);
		const randomType = allBonusTypes[randomIndex];
		this.addBonus(randomType, x, y);
	}

	update(): void {
		this.time++;

		// Logique de réanimation
		if (this.players.size > 1) {
			const playersArray = Array.from(this.players.values());
			const alivePlayers = playersArray.filter(p => p.isAlive() && !p.isGhost);
			const ghostPlayers = playersArray.filter(p => !p.isAlive() && p.isGhost);

			if (alivePlayers.length > 0) {
				ghostPlayers.forEach(ghost => {
					let beingRevived = false;
					alivePlayers.forEach(alive => {
						const ghostCenter = { x: ghost.x + ghost.width / 2, y: ghost.y + ghost.height / 2 };
						const aliveCenter = { x: alive.x + alive.width / 2, y: alive.y + alive.height / 2 };
						const dx = ghostCenter.x - aliveCenter.x;
						const dy = ghostCenter.y - aliveCenter.y;
						const distance = Math.sqrt(dx * dx + dy * dy);

						if (distance < 150) {
							beingRevived = true;
						}
					});

					if (beingRevived) {
						ghost.reviveProgress += 1;
						// temps de revive 3s
						if (ghost.reviveProgress >= 180) {
							ghost.revive();
						}
					} else {
						ghost.reviveProgress = 0;
					}
				});
			} else {
				ghostPlayers.forEach(ghost => ghost.isGhost = false);
			}
		}

		this.players.forEach(player => player.update());
		this.players.forEach(player => player.arme.updateBullets());
		this.bonuses.forEach(bonus => bonus.update());
		this.enemyBullets.forEach(bullet => bullet.update());

		// Détruire des drones avec les balles
		const bulletsToRemove = new Set<string>();
		const enemiesToRemove = new Set<string>();
		const enemyBulletsToRemove = new Set<string>();

		const allBullets = Array.from(this.players.values()).flatMap(
			p => p.arme.bullets
		);

		allBullets.forEach(bullet => {
			// Collision balles joueur -> ennemis
			this.enemies.forEach(enemy => {
				if (checkCollision(bullet, enemy)) {
					const player = this.players.get(bullet.ownerId);
					if (enemy.type === 'DRONE') {
						enemy.takeDamage(16);
						bulletsToRemove.add(bullet.id);

						if (!enemy.isAlive() && !enemiesToRemove.has(enemy.id)) {
							enemiesToRemove.add(enemy.id);
							const config = EnemyConfigs[enemy.type as EnemyType];
							this.score += config.scoreValue;
							this.enemyCount++;
							this.countDrone++;
							if (player) player.score += 20;
							if (Math.random() < 0.2) this.dropRandomBonus(enemy.x, enemy.y);
						}
					} else if (enemy.type === 'PNEU') {
						enemy.takeDamage(11);
						bulletsToRemove.add(bullet.id);
						if (!enemy.isAlive() && !enemiesToRemove.has(enemy.id)) {
							enemiesToRemove.add(enemy.id);
							this.score += 10;
							this.enemyCount++;
							this.countPneu++;
							if (player) player.score += 10;
							if (Math.random() < 0.2) this.dropRandomBonus(enemy.x, enemy.y);
						}
					}
				}
			});

			// Collision balles joueur -> balles ennemis
			this.enemyBullets.forEach(enemyBullet => {
				if (checkCollision(bullet, enemyBullet)) {
					bulletsToRemove.add(bullet.id);
					enemyBulletsToRemove.add(enemyBullet.id);
				}
			});
		});

		this.checkPlayerCollisions(enemyBulletsToRemove);

		// Nettoyage des balles (on utilise bulletsToRemove ici pour marquer l'impact)
		this.players.forEach(player => {
			player.arme.bullets = player.arme.bullets.filter(
				b => !bulletsToRemove.has(b.id) && b.x < 2000
			);
		});

		// Nettoyage des balles ennemis hors de l'écran ou touchées (limites larges pour drones spawns)
		this.enemyBullets = this.enemyBullets.filter(
			b =>
				!enemyBulletsToRemove.has(b.id) &&
				b.x > -100 &&
				b.x < 2020 &&
				b.y > -100 &&
				b.y < 1180
		);

		if (this.players.size > 0) {
			this.spawnEnemyService.update(this.time, true, this.enemies);
		} else if (this.time > 0) {
			this.time = 0;
			this.enemies = [];
			this.bonuses = [];
			this.enemyBullets = [];
			this.spawnEnemyService.reset();
		}

		this.enemies.forEach(enemy => {
			enemy.update();

			// Trouver le joueur le plus proche pour viser
			let nearestPlayer: ServerPlayer | null = null;
			let minDistance = Infinity;

			for (const player of this.players.values()) {
				if (player.isAlive()) {
					const dx = player.x - enemy.x;
					const dy = player.y - enemy.y;
					const dist = Math.sqrt(dx * dx + dy * dy);
					if (dist < minDistance) {
						minDistance = dist;
						nearestPlayer = player;
					}
				}
			}

			const bullet = nearestPlayer
				? enemy.shoot(
						nearestPlayer.x + nearestPlayer.width / 2,
						nearestPlayer.y + nearestPlayer.height / 2
					)
				: enemy.shoot();

			if (bullet) {
				this.enemyBullets.push(bullet);
			}
		});

		// Suppression des ennemis hors champ (avec une marge pour le spawn)
		this.enemies = this.enemies.filter(
			e => !enemiesToRemove.has(e.id) && 
				 e.x > -500 && e.x < 2500 && 
				 e.y > -500 && e.y < 1500
		);
		this.bonuses = this.bonuses.filter(b => b.x > -200);

		this.io.to(this.roomId).emit('gameState', this.getState());
	}

	private checkPlayerCollisions(enemyBulletsToRemove: Set<string>) {
		this.players.forEach(player => {
			if (!player.isAlive()) return;

			// Collision avec balles ennemis
			this.enemyBullets.forEach(bullet => {
				if (checkCollision(player, bullet)) {
					const died = player.takeDamage();
					enemyBulletsToRemove.add(bullet.id);
					if (died) {
						leaderboardService.addEntry({
							joueur: player.getAccount().username,
							score: this.score,
							date: Date.now(),
						});
					}
				}
			});

			this.bonuses = this.bonuses.filter(bonus => {
				const isColliding = checkCollision(player, bonus);

				if (isColliding) {
					player.addBonus(bonus.type);
					return false; //pour le suprimer de la liste
				}
				return true;
			});

			this.enemies.forEach(enemy => {
				if (checkCollision(player, enemy)) {
					// Pas de collision du tout si on saute par-dessus un pneu
					if (player.getIsJumping() && enemy.type === 'PNEU') {
						return;
					}

					const died = player.takeDamage();
					if (died) {
						if (this.players.size > 1) {
							const aliveOthers = Array.from(this.players.values()).filter(p => p.id !== player.id && p.isAlive() && !p.isGhost);
							if (aliveOthers.length > 0) {
								player.isGhost = true;
							}
						}

						leaderboardService.addEntry({
							joueur: player.getAccount().username,
							score: this.score,
							date: Date.now(),
						});
					}

					// pour repousser le joueur bord à bord
					const overlap = getOverlap(player, enemy);
					const playerCenter = getCenter(player);
					const enemyCenter = getCenter(enemy);

					if (overlap.x < overlap.y) {
						if (playerCenter.x < enemyCenter.x) {
							player.x = enemy.x - player.width;
						} else {
							player.x = enemy.x + enemy.width;
						}
					} else {
						if (playerCenter.y < enemyCenter.y) {
							player.y = enemy.y - player.height;
						} else {
							player.y = enemy.y + enemy.height;
						}
					}
				}
			});
		});
	}

	getState(): GameState {
		return {
			players: Array.from(this.players.values()).map(p => p.toData()),
			bullets: [
				...Array.from(this.players.values()).flatMap(p =>
					p.arme.bullets.map(b => b.toData())
				),
				...this.enemyBullets.map(b => b.toData()),
			],
			enemies: this.enemies.map(e => e.toData()),
			bonuses: this.bonuses.map(b => b.toData()),
			time: this.time,
			score: this.score,
			enemyCount: this.enemyCount,
			countDrone: this.countDrone,
			countPneu: this.countPneu,
		};
	}
}
