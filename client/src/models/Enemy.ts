import type { HitBox } from '../../../common/HitBox.ts';
import { Direction } from '../../../common/Direction.ts';
import type { EnemyData } from '../../../common/types.ts';
import SpriteSheetService from '../services/SpriteSheetService.ts';
import {
	PlaySpriteSheet,
	SpriteSheetConfigs,
} from '../../../common/SpriteSheetConfig.ts';
import type { Frame } from '../Frame.ts';

export default class Enemy {
	public id: string;
	private hitbox: HitBox;
	private velocity: number;
	private sprite: SpriteSheetService;
	private direction: Direction;
	private isDamaged: boolean = false;
	private isDying: boolean = false;
	public readyToRemove: boolean = false;
	private spriteSheetType: PlaySpriteSheet;

	constructor(data: EnemyData) {
		this.id = data.id;
		this.velocity = 1;
		this.direction = Direction.Left;

		this.spriteSheetType =
			data.type === 'PNEU' ? PlaySpriteSheet.PNEU : PlaySpriteSheet.DRONE;
		this.sprite = new SpriteSheetService(this.spriteSheetType, 0);

		this.hitbox = {
			x: data.x,
			y: data.y,
			width: data.width || this.sprite.getWidth(),
			height: data.height || this.sprite.getHeight(),
		};
	}

	updateFromData(data: EnemyData): void {
		this.hitbox.x = data.x;
		this.hitbox.y = data.y;
		if (data.width) this.hitbox.width = data.width;
		if (data.height) this.hitbox.height = data.height;
		this.isDamaged = data.isDamaged ?? false;
	}

	getPosition(): HitBox {
		return this.hitbox;
	}

	move(): void {
		//Deplacement des ennemis
		this.velocity;
		this.direction;
	}

	update(): void {
		this.move();
	}

	die(): void {
		if (this.isDying) return;
		this.isDying = true;

		if (this.spriteSheetType === PlaySpriteSheet.PNEU) {
			const config = SpriteSheetConfigs.PNEU;
			this.sprite.setAnimationParams(false, config.columns);
		} else {
			this.readyToRemove = true;
		}
	}

	draw(ctx: CanvasRenderingContext2D): void {
		let frame: Frame = this.sprite.getFrame();

		if (this.isDying && this.sprite.isAnimationFinished()) {
			this.readyToRemove = true;
		}

		if (this.isDamaged) {
			// Applique un filtre rouge intense
			ctx.filter = 'sepia(1) saturate(1000%) hue-rotate(-50deg)';
		}

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

		if (this.isDamaged) {
			ctx.filter = 'none';
		}
	}
}
