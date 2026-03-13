export type PlaySpriteSheet = 'PLAYER';

export const PlaySpriteSheet = {
	PLAYER: 'PLAYER' as PlaySpriteSheet,
};

export type SpriteSheetConfig = {
	path: string;
	columns: number;
	rows: number;
};

export const SpriteSheetConfigs: Record<PlaySpriteSheet, SpriteSheetConfig> = {
	[PlaySpriteSheet.PLAYER]: {
		path: '/assets/Player.png',
		columns: 7,
		rows: 6,
	},
};
