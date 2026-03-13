import type { Account } from '../../common/types.ts';
import type { HitBox } from '../../common/HitBox.ts';
import type { Weapon } from '../Weapon.ts';
import type { Bonus } from '../Bonus.ts';
import { Direction } from '../../common/Direction.ts';
import SpriteSheetService from '../services/SpriteSheetService.ts';
import { PlaySpriteSheet } from '../SpriteSheetConfig.ts';
import type { Frame } from '../Frame.ts';

class Player {
	private joueur: Account;
	private jump;
	private hitbox: HitBox;
	private score: number;
	private weapons: Weapon[];
	private bonus: Bonus[];
	velocity: number;
	sprite: SpriteSheetService;

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
		this.velocity = 10;
		this.jump = { jumpping: false, cooldown: 0 };
		switch (joueur.avatar) {
			case 'pedalBleu':
				this.sprite = new SpriteSheetService(PlaySpriteSheet.PLAYER, 4);
				break;
			case 'pedalOrange':
				this.sprite = new SpriteSheetService(PlaySpriteSheet.PLAYER, 2);
				break;
			case 'pedalViolet':
				this.sprite = new SpriteSheetService(PlaySpriteSheet.PLAYER, 0);
				break;
			default:
				this.sprite = new SpriteSheetService(PlaySpriteSheet.PLAYER, 4);
		}
		this.hitbox = {
			x: x,
			y: y,
			width: this.sprite.getWidth(),
			height: this.sprite.getHeight(),
		};
	}

	isJumping(): boolean {
		return this.jump.jumpping;
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

	doJump(): void {
		if (!this.isJumping() && this.jump.cooldown < 0) {
			this.jump = { jumpping: true, cooldown: 10 };
		}
	}

	draw(ctx: CanvasRenderingContext2D): void {
		let frame: Frame = this.sprite.getFrame();
		console.log(frame);
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
