import type { Account, PlayerData } from '../../../common/types.ts';
import type { HitBox } from '../../../common/HitBox.ts';
import type { Weapon } from '../Weapon.ts';
import { Direction } from '../../../common/Direction.ts';
import SpriteSheetService from '../services/SpriteSheetService.ts';
import {
	PlaySpriteSheet,
	SpriteSheetConfigs,
	AvatarRowMapping,
} from '../SpriteSheetConfig.ts';
import type { Frame } from '../Frame.ts';
import { BonusType } from '../../../common/BonusType.ts';
import type Bonus from './Bonus.ts';

class Player {
	private joueur: Account;
	private jump: { jumping: boolean };
	private hitbox: HitBox;
	private score: number;
	private weapons: Weapon[];
	private bonus: Bonus[];
	private baseRow: number;
	velocity: number;
	sprite: SpriteSheetService;
	public id: string = '';

	constructor(joueur: Account | null, x: number, y: number) {
		if (joueur == null) {
			joueur = { username: 'temp', avatar: 'pedalBleu' };
		}
		this.joueur = joueur;
		this.weapons = [
			{ nom: 'attaque de base', degat: 2, tier: 1, tierMin: 1, tierMax: 5 },
		];
		this.bonus = [];
		this.score = 0;
		this.velocity = 2;
		this.jump = { jumping: false };

		this.baseRow =
			AvatarRowMapping[joueur.avatar] ?? AvatarRowMapping.pedalBleu;
		this.sprite = new SpriteSheetService(PlaySpriteSheet.PLAYER, this.baseRow);

		this.hitbox = {
			x: x,
			y: y,
			width: this.sprite.getWidth(),
			height: SpriteSheetConfigs.PLAYER.spriteHeight,
		};
	}

	updateFromData(data: PlayerData): void {
		this.hitbox.x = data.x;
		this.hitbox.y = data.y;
		this.score = data.score;

		// Mise à jour visuelle (sprite row)
		if (data.isJumping != this.jump.jumping) {
			if (data.isJumping) {
				this.sprite.setRow(this.baseRow + 1);
			} else {
				this.sprite.setRow(this.baseRow);
			}
		}
		this.jump.jumping = data.isJumping;

		// Sync bonuses
		if (data.bonuses) {
			// Remove bonuses that are no longer present
			this.bonus = this.bonus.filter((b) => data.bonuses.includes(b.type.bonusType));

			// Add new bonuses
			data.bonuses.forEach((typeId) => {
				const hasBonus = this.bonus.some((b) => b.type.bonusType === typeId);
				if (!hasBonus) {
					const type = Object.values(BonusType).find((bt) => bt.bonusType === typeId);
					if (type) {
						const sprite = new SpriteSheetService(
							PlaySpriteSheet[type.sprite as keyof typeof PlaySpriteSheet],
							type.rows.MAP
						);
						this.bonus.push(new Bonus(type, sprite));
					}
				}
			});
		}
	}

	isJumping(): boolean {
		return this.jump.jumping;
	}

	getPostition(): HitBox {
		return this.hitbox;
	}

	getAccoutn(): Account {
		return this.joueur;
	}

	getScore(): number {
		return this.score;
	}

	addScore(score: number = 10): void {
		this.score += score;
	}

	getWeapon(): Weapon[] {
		return this.weapons;
	}

	getBonus(): Bonus[] {
		return this.bonus;
	}

	addBonus(bonus: Bonus): void {
		if (bonus.type.bonusType === BonusType.Shield.bonusType) {
			const hasShield = this.bonus.some(
				b => b.type.bonusType === BonusType.Shield.bonusType
			);
			if (hasShield) return;
		}
		this.bonus.push(bonus);
	}

	move(direction: Direction): void {
		switch (direction) {
			case Direction.Left:
				this.hitbox.x -= this.velocity;
				break;
			case Direction.Right:
				this.hitbox.x += this.velocity;
				break;
			case Direction.Up:
				this.hitbox.y -= this.velocity;
				break;
			case Direction.Down:
				this.hitbox.y += this.velocity;
		}
	}

	draw(ctx: CanvasRenderingContext2D): void {
		let frame: Frame = this.sprite.getFrame();
		ctx.drawImage(
			frame.img,
			frame.x,
			frame.y,
			frame.width,
			frame.height,
			this.hitbox.x,
			this.hitbox.y,
			frame.width,
			frame.height
		);

		// Dessiner les effets des bonus sur le joueur
		this.bonus.forEach(b => {
			b.drawOnPlayer(ctx, this.hitbox.x, this.hitbox.y);
		});
	}

	drawHUD(ctx: CanvasRenderingContext2D): void {
		// Dessiner les bonus dans le HUD
		let startX = 10;
		let startY = 10;
		this.bonus.forEach((b, index) => {
			b.drawInHUD(ctx, startX + index * 40, startY);
		});
	}
}

export default Player;
