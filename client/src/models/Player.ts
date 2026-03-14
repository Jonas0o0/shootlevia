import type { Account, PlayerData } from '../../../common/types.ts';
import type { HitBox } from '../../../common/HitBox.ts';
import type { Weapon } from '../Weapon.ts';
import type { Bonus } from '../Bonus.ts';
import { Direction } from '../../../common/Direction.ts';
import SpriteSheetService from '../services/SpriteSheetService.ts';
import {
	PlaySpriteSheet,
	SpriteSheetConfigs,
	AvatarRowMapping,
} from '../SpriteSheetConfig.ts';
import type { Frame } from '../Frame.ts';

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
		this.bonus = [{ nom: 'Passpass', time: 2, avantage: 'Invincibilité' }];
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
	}
}

export default Player;
