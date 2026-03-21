import { ServerPlayer } from './Player.ts';
import type { GameState } from '../../common/types.ts';
import { Direction } from '../../common/Direction.ts';
import { ServerEnemy } from './ServerEnemy.ts';
import { SpawnEnemyService } from '../services/SpawnEnemyService.ts';
import ServerBonus from './Bonus.ts';
import { BonusType } from '../../common/BonusType.ts';
import { checkCollision, getCenter, getOverlap } from '../../common/HitBox.ts';

export class ServerGame {
	private players: Map<string, ServerPlayer> = new Map();
	private enemies: ServerEnemy[] = [];
	private bonuses: ServerBonus[] = [];
	private time: number = 0;
	private score: number = 0;

	private spawnEnemyService: SpawnEnemyService = new SpawnEnemyService();

	constructor() {
		// Boucle de jeu (60fps)
		setInterval(() => this.update(), 1000 / 60);
	}

	reset(): void {
		console.log('reset la partie est cense fonctionne');
		this.players.clear();
		this.enemies = [];
		this.bonuses = [];
		this.time = 0;
		this.score = 0;
		this.spawnEnemyService = new SpawnEnemyService();
	}

	addPlayer(id: string, username: string, avatar: string, canvasWidth: number, canvasHeight: number): void {
		const x = 100; // Position de départ par défaut
		const y = 300;
		this.players.set(id, new ServerPlayer(id, { username, avatar }, x, y, canvasWidth, canvasHeight));
	}

	removePlayer(id: string): void {
		this.players.delete(id);
	}

	handlePlayerMove(id: string, directions: Direction[]): void {
		const player = this.players.get(id);
		if (player) {
			directions.forEach(dir => player.move(dir));
		}
	}

	handlePlayerJump(id: string): void {
		const player = this.players.get(id);
		if (player) {
			player.doJump();
		}
	}

	handlePlayerShoot(id: string): void {
		const player = this.players.get(id);
		if (player) {
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
		this.players.forEach(player => player.update());
		this.players.forEach(player => player.arme.updateBullets());
		this.bonuses.forEach(bonus => bonus.update());

		// Détruire des drones avec les balles
		const bulletsToRemove = new Set<string>();
		const enemiesToRemove = new Set<string>();

		const allBullets = Array.from(this.players.values()).flatMap(p => p.arme.bullets);

		allBullets.forEach(bullet => {
			this.enemies.forEach(enemy => {
				if (checkCollision(bullet, enemy)) {
					if (enemy.type === 'DRONE') {
						enemy.takeDamage(16);
						bulletsToRemove.add(bullet.id);
						if (!enemy.isAlive() && !enemiesToRemove.has(enemy.id)) {
							enemiesToRemove.add(enemy.id);
							this.score += 20;
							if (Math.random() < 0.2) this.dropRandomBonus(enemy.x, enemy.y);
						}
					} else if (enemy.type === 'PNEU') {
						enemy.takeDamage(11);
						bulletsToRemove.add(bullet.id);
						if (!enemy.isAlive() && !enemiesToRemove.has(enemy.id)) {
							enemiesToRemove.add(enemy.id);
							this.score += 10;
							if (Math.random() < 0.2) this.dropRandomBonus(enemy.x, enemy.y);
						}
					}
				}
			});
		});

		this.checkPlayerCollisions();

		// Nettoyage des balles (on utilise bulletsToRemove ici pour marquer l'impact)
		this.players.forEach(player => {
			player.arme.bullets = player.arme.bullets.filter(b => !bulletsToRemove.has(b.id) && b.x < 2000);
		});

		if (this.players.size > 0) {
			this.spawnEnemyService.update(this.time, true, this.enemies);
		} else if (this.time > 0) {
			this.time = 0;
			this.enemies = [];
			this.bonuses = [];
			this.spawnEnemyService.reset();
		}

		this.enemies.forEach(enemy => enemy.update());
		this.enemies = this.enemies.filter(e => !enemiesToRemove.has(e.id) && e.x > -200 && e.y < 2000);
		this.bonuses = this.bonuses.filter(b => b.x > -200);
	}

	private checkPlayerCollisions() {
		this.players.forEach(player => {
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

					player.takeDamage();

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
			bullets: Array.from(this.players.values()).flatMap(p => p.arme.bullets.map(b => b.toData())),
			enemies: this.enemies.map(e => e.toData()),
			bonuses: this.bonuses.map(b => b.toData()),
			time: this.time,
			score: this.score,
		};
	}
}
