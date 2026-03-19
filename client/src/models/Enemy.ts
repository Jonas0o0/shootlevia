import type { HitBox } from '../../../common/HitBox.ts';
import { Direction } from '../../../common/Direction.ts';
import type { EnemyData } from '../../../common/types.ts';
import SpriteSheetService from '../services/SpriteSheetService.ts';
import { PlaySpriteSheet } from '../../../common/SpriteSheetConfig.ts';
import type { Frame } from '../Frame.ts';

export default class Enemy {
	public id: string;
	private hitbox: HitBox;
	private velocity: number;
	private sprite: SpriteSheetService;
	private direction: Direction;

	constructor(data: EnemyData) {
		this.id = data.id;
		this.velocity = 1;
		this.direction = Direction.Left;

		const spriteSheet =
			data.type === 'PNEU' ? PlaySpriteSheet.PNEU : PlaySpriteSheet.DRONE;
		this.sprite = new SpriteSheetService(spriteSheet, 0);

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
