import type { HitBox } from '../../../common/HitBox.ts';
import { Direction } from '../../../common/Direction.ts';
import type { EnemyData } from '../../../common/types.ts';
import SpriteSheetService from '../services/SpriteSheetService.ts';
import {
	PlaySpriteSheet,
	SpriteSheetConfigs,
} from '../../../common/SpriteSheetConfig.ts';
import type { Frame } from '../Frame.ts';

export default class Enemy implements HitBox {
	public id: string;
	public x: number;
	public y: number;
	public width: number;
	public height: number;
	private readonly velocity: number;
	private sprite: SpriteSheetService;
	private readonly direction: Direction;
	private isDamaged: boolean = false;
	private isDying: boolean = false;
	public readyToRemove: boolean = false;
	private readonly spriteSheetType: PlaySpriteSheet;

	constructor(data: EnemyData) {
		this.id = data.id;
		this.velocity = 1;
		this.direction = Direction.Left;

		this.spriteSheetType =
			data.type === 'PNEU' ? PlaySpriteSheet.PNEU : PlaySpriteSheet.DRONE;
		this.sprite = new SpriteSheetService(this.spriteSheetType, 0);

		this.x = data.x;
		this.y = data.y;
		this.width = data.width || this.sprite.getWidth();
		this.height = data.height || this.sprite.getHeight();
	}

	updateFromData(data: EnemyData): void {
		this.x = data.x;
		this.y = data.y;
		if (data.width) this.width = data.width;
		if (data.height) this.height = data.height;
		this.isDamaged = data.isDamaged ?? false;
	}

	move(): void {
		if (this.direction === Direction.Left) {
			this.x -= this.velocity;
		}
	}

	die(): void {
		if (!this.isDying) {
			this.isDying = true;
			if (this.spriteSheetType === PlaySpriteSheet.PNEU) {
				const config = SpriteSheetConfigs.PNEU;
				this.sprite.setAnimationParams(false, config.columns);
			} else {
				this.readyToRemove = true;
			}
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
			this.x,
			this.y,
			frame.width,
			frame.height
		);

		if (this.isDamaged) {
			ctx.filter = 'none';
		}
	}
}
