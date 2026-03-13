export type PlaySpriteSheet = 'PLAYER';

export const PlaySpriteSheet = {
	PLAYER: 'PLAYER' as PlaySpriteSheet,
};

export type SpriteSheetConfig = {
	path: string;
	columns: number;
	rows: number;
	spriteWidth: number;
	spriteHeight: number;
	columnsFrameMax: number;
};

export const SpriteSheetConfigs: Record<PlaySpriteSheet, SpriteSheetConfig> = {
	[PlaySpriteSheet.PLAYER]: {
		path: '/assets/Player.png',
		columns: 7,
		rows: 6,
		spriteWidth: 0,
		spriteHeight: 0,
		columnsFrameMax: 0,
	},
};
