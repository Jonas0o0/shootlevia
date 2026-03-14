export type PlaySpriteSheet = 'PLAYER'| 'DRONE';

export const PlaySpriteSheet = {
	PLAYER: 'PLAYER' as PlaySpriteSheet,
	DRONE: 'DRONE' as PlaySpriteSheet,
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
	PLAYER: {
		path: '/assets/Player.png',
		columns: 7,
		rows: 6,
		spriteWidth: 0,
		spriteHeight: 0,
		columnsFrameMax: 0,
	},
	DRONE: {
		path: '/assets/Drone-volant-caméra-gauche-spritesheet.png',
		columns: 6,
		rows: 1,
		spriteWidth: 0,
		spriteHeight: 0,
		columnsFrameMax: 0,
	}
};

export const AvatarRowMapping: Record<string, number> = {
	bleu: 4,
	orange: 2,
	violet: 0,
};
