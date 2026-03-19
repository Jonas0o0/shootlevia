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

	getFrame(): Frame {
		this.tick++;
		if (this.tick >= this.animationSpeed) {
			this.frameX = (this.frameX + 1) % this.spriteSheet.columnsFrameMax;
			this.tick = 0;
		}

		const frameW = this.spriteSheet.spriteWidth;
		const frameH = this.spriteSheet.spriteHeight;

		const srcX = this.frameX * frameW;
		const srcY = this.frameY * frameH;
		//const srcW = Math.min(frameW, this.img.width - srcX);
		//const srcH = Math.min(frameH, this.img.height - srcY);

		return {
			img: this.img,
			x: srcX,
			y: srcY,
			width: frameW,
			height: frameH,
		};
	}
}
