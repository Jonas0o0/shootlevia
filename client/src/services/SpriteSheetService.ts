import {
	PlaySpriteSheet,
	type SpriteSheetConfig,
	SpriteSheetConfigs,
} from '../../../common/SpriteSheetConfig.ts';
import type { Frame } from '../Frame.ts';
import AssetLoaderService from './AssetLoaderService.ts';

export default class SpriteSheetService {
	private spriteSheet: SpriteSheetConfig;
	private img: HTMLImageElement;

	private frameX;
	private frameY;
	private tick: number = 0;
	private animationSpeed: number = 5; // Plus ce nombre est grand, plus l'animation est lente

	constructor(spriteSheet: PlaySpriteSheet, defautRow: number) {
		this.spriteSheet = { ...SpriteSheetConfigs[spriteSheet] };
		this.img = AssetLoaderService.get(this.spriteSheet.path);

		this.frameX = 0;
		this.frameY =
			defautRow >= 0 && defautRow < this.spriteSheet.rows ? defautRow : 0;
		if (this.spriteSheet.isStatic) {
			this.spriteSheet.columnsFrameMax = 1;
		} else if (defautRow % 2 === 0) {
			this.spriteSheet.columnsFrameMax = this.spriteSheet.columns - 1;
		} else {
			this.spriteSheet.columnsFrameMax = this.spriteSheet.columns;
		}

		// On calcule les dimensions car l'image est déjà chargée via AssetLoaderService
		this.spriteSheet.spriteWidth = this.img.width / this.spriteSheet.columns;
		this.spriteSheet.spriteHeight = this.img.height / this.spriteSheet.rows;
	}

	setRow(row: number) {
		if (row >= 0 && row < this.spriteSheet.rows) {
			this.frameY = row;
			if (this.spriteSheet.isStatic) {
				this.spriteSheet.columnsFrameMax = 1;
			} else if (row % 2 === 0) {
				this.spriteSheet.columnsFrameMax = this.spriteSheet.columns - 1;
			} else {
				this.spriteSheet.columnsFrameMax = this.spriteSheet.columns;
			}
			this.frameX = 0;
			this.tick = 0;
			return;
		}
		console.warn('[PlayView] ligne invalide', row);
	}

	getRow(): number {
		return this.frameY;
	}

	setAnimationParams(isStatic: boolean, columns: number) {
		this.spriteSheet.isStatic = isStatic;
		this.spriteSheet.columnsFrameMax = columns;
		this.frameX = 0;
		this.tick = 0;
	}

	isAnimationFinished(): boolean {
		return this.frameX >= this.spriteSheet.columnsFrameMax - 1;
	}

	getWidth(): number {
		return this.spriteSheet.spriteWidth;
	}

	getHeight(): number {
		return this.spriteSheet.spriteHeight;
	}

	public static calculateFrameIndex(
		currentFrame: number,
		currentTick: number,
		animationSpeed: number,
		maxFrames: number,
	): { nextFrame: number; nextTick: number } {
		let nextTick = currentTick + 1;
		let nextFrame = currentFrame;

		if (nextTick >= animationSpeed) {
			nextFrame = (currentFrame + 1) % maxFrames;
			nextTick = 0;
		}

		return { nextFrame, nextTick };
	}

	public static calculateSourceCoords(
		frameX: number,
		frameY: number,
		spriteWidth: number,
		spriteHeight: number,
	): { srcX: number; srcY: number } {
		return {
			srcX: frameX * spriteWidth,
			srcY: frameY * spriteHeight,
		};
	}

	getFrame(): Frame {
		const { nextFrame, nextTick } = SpriteSheetService.calculateFrameIndex(
			this.frameX,
			this.tick,
			this.animationSpeed,
			this.spriteSheet.columnsFrameMax,
		);

		this.frameX = nextFrame;
		this.tick = nextTick;

		const { srcX, srcY } = SpriteSheetService.calculateSourceCoords(
			this.frameX,
			this.frameY,
			this.spriteSheet.spriteWidth,
			this.spriteSheet.spriteHeight,
		);

		return {
			img: this.img,
			x: srcX,
			y: srcY,
			width: this.spriteSheet.spriteWidth,
			height: this.spriteSheet.spriteHeight,
		};
	}
}
