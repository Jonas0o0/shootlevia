import type { HitBox } from '../../../common/HitBox.ts';
import { Direction } from '../../../common/Direction.ts';
import type { EnemyData } from '../../../common/types.ts';
import SpriteSheetService from '../services/SpriteSheetService.ts';
import { PlaySpriteSheet } from '../../../common/SpriteSheetConfig.ts';
import type { Frame } from '../Frame.ts';

export default class Boss implements HitBox {
	public id: string;
	public x: number;
	public y: number;
	public width: number;
	public height: number;
	private velocity: number;
	private sprite: SpriteSheetService;
	private currentDirection: Direction;
	private isDamaged: boolean = false;
	private isDying: boolean = false;
	public readyToRemove: boolean = false;
	private readonly spriteSheetType: PlaySpriteSheet;

	private minY: number;
	private maxY: number;

	constructor(data: EnemyData, maxY: number = 600, minY: number = 0) {
		this.id = data.id;
		this.velocity = 2;
		this.currentDirection = Direction.Up;

		this.spriteSheetType = PlaySpriteSheet.BUS_RELAY;
		this.sprite = new SpriteSheetService(this.spriteSheetType, 0);

		this.x = data.x;
		this.y = data.y;
		this.width = data.width || this.sprite.getWidth();
		this.height = data.height || this.sprite.getHeight();
		
		this.minY = minY;
		this.maxY = maxY;
	}

	updateFromData(data: EnemyData): void {
		this.x = data.x;
		this.y = data.y;
		if (data.width) this.width = data.width;
		if (data.height) this.height = data.height;
		this.isDamaged = data.isDamaged ?? false;
	}

	move(): void {
		if (this.currentDirection === Direction.Up) {
			this.y -= this.velocity;
			if (this.y <= this.minY) {
				this.currentDirection = Direction.Down;
			}
		} else if (this.currentDirection === Direction.Down) {
			this.y += this.velocity;
			if (this.y + this.height >= this.maxY) {
				this.currentDirection = Direction.Up;
			}
		}
	}

	die(): void {
		if (!this.isDying) {
			this.isDying = true;
			this.readyToRemove = true;
		}
	}

	draw(ctx: CanvasRenderingContext2D): void {
		let frame: Frame = this.sprite.getFrame();

		if (this.isDying && this.sprite.isAnimationFinished()) {
			this.readyToRemove = true;
		}

		if (this.isDamaged) {
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
			this.width,
			this.height
		);

		if (this.isDamaged) {
			ctx.filter = 'none';
		}
	}
}
