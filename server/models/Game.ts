import { ServerPlayer } from './Player.ts';
import type { GameState } from '../../common/types.ts';
import { Direction } from '../../common/Direction.ts';
import { ServerBullet } from './Bullet.ts';
import { ServerEnemy } from './ServerEnemy.ts';
import { SpawnEnemyService } from '../services/SpawnEnemyService.ts';
import ServerBonus from './Bonus.ts';
import type { BonusType } from '../../common/BonusType.ts';
import { SpriteSheetConfigs } from '../../common/SpriteSheetConfig.ts';

export class ServerGame {
	private players: Map<string, ServerPlayer> = new Map();
	private bullets: ServerBullet[] = [];
	private enemies: ServerEnemy[] = [];
	private bonuses: ServerBonus[] = [];
	private time: number = 0;

	private spawnEnemyService: SpawnEnemyService = new SpawnEnemyService();

	constructor() {
		// Boucle de jeu (60fps)
		setInterval(() => this.update(), 1000 / 60);
	}

	addPlayer(id: string, username: string, avatar: string): void {
		const x = 100; // Position de départ par défaut
		const y = 300;
		this.players.set(id, new ServerPlayer(id, { username, avatar }, x, y));
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
			const bullet = new ServerBullet(
				id,
				player.x + player.width,
				player.y + player.height / 2
			);
			this.bullets.push(bullet);
		}
	}

	addBonus(type: BonusType, x: number, y: number): void {
		const id = crypto.randomUUID();
		this.bonuses.push(new ServerBonus(id, type, x, y));
	}

	update(): void {
		this.time++;
		if (this.players.size > 0) {
			this.spawnEnemyService.update(this.time, true, this.enemies);
		} else if (this.time > 0) {
			this.time = 0;
			this.enemies = [];
			this.bonuses = [];
			this.spawnEnemyService.reset();
		}

		this.players.forEach(player => player.update());
		this.bullets.forEach(bullet => bullet.update());
		this.enemies.forEach(enemy => enemy.update());
		this.bonuses.forEach(bonus => bonus.update());

		this.checkColision();

		this.bullets = this.bullets.filter(b => b.x < 2000);
		this.enemies = this.enemies.filter(e => e.x > -200 && e.y < 2000);
		this.bonuses = this.bonuses.filter(b => b.x > -200);
	}

	checkColision() {
		this.players.forEach(player => {
			this.bonuses = this.bonuses.filter(bonus => {
				const config = SpriteSheetConfigs[bonus.type.sprite];
				const isColliding =
					player.x < bonus.x + config.spriteWidth &&
					player.x + player.width > bonus.x &&
					player.y < bonus.y + config.spriteHeight &&
					player.y + player.height > bonus.y;

				if (isColliding) {
					player.addBonus(bonus.type);
					return false; //pour le suprimer de la liste
				}
				return true;
			});

			this.enemies.forEach(enemy => {
				const isColliding =
					player.x < enemy.x + enemy.width &&
					player.x + player.width > enemy.x &&
					player.y < enemy.y + enemy.height &&
					player.y + player.height > enemy.y;

				if (isColliding) {
					player.takeDamage();

					// pour repousser le joueur bord à bord
					const overlapX = Math.min(
						player.x + player.width - enemy.x,
						enemy.x + enemy.width - player.x
					);
					const overlapY = Math.min(
						player.y + player.height - enemy.y,
						enemy.y + enemy.height - player.y
					);

					if (overlapX < overlapY) {
						if (player.x + player.width / 2 < enemy.x + enemy.width / 2) {
							player.x = enemy.x - player.width;
						} else {
							player.x = enemy.x + enemy.width;
						}
					} else {
						if (player.y + player.height / 2 < enemy.y + enemy.height / 2) {
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
			bullets: this.bullets.map(b => b.toData()),
			enemies: this.enemies.map(e => e.toData()),
			bonuses: this.bonuses.map(b => b.toData()),
			time: this.time,
		};
	}
}
