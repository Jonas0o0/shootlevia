import type { HitBox } from '../../../common/HitBox.ts';
import { Direction } from '../../../common/Direction.ts';
import SpriteSheetService from '../services/SpriteSheetService.ts';
import {
	PlaySpriteSheet,
	SpriteSheetConfigs,
} from '../SpriteSheetConfig.ts';
import type { Frame } from '../Frame.ts';

export default class Enemy {
	private hitbox: HitBox;
	private health: number;
	private velocity: number;
	private sprite: SpriteSheetService;
	private direction: Direction;

	constructor(x: number, y: number) {
		this.health = 100;
		this.velocity = 1;
		this.direction = Direction.Left;
		this.sprite = new SpriteSheetService(PlaySpriteSheet.PLAYER, 0);

		this.hitbox = {
			x: x,
			y: y,
			width: this.sprite.getWidth(),
			height: this.sprite.getHeight(),
		};
	}

	getPosition(): HitBox {
		return this.hitbox;
	}

	getHealth(): number {
		return this.health;
	}

	takeDamage(damage: number): void {
		this.health -= damage;
		if (this.health < 0) {
			this.health = 0;
		}
	}

	isAlive(): boolean {
		return this.health > 0;
	}

	move(): void {
		//Deplacement des ennemis
        this.velocity;
        this.direction;
	}

	update(): void {
		this.move();
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