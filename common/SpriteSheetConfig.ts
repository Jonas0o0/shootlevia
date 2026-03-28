import path from "node:path";

export type PlaySpriteSheet = 'PLAYER' | 'DRONE' | 'PNEU' | 'PASS_PASS' | 'POWER_UP' | 'BUS_RELAY';

export const PlaySpriteSheet = {
	PLAYER: 'PLAYER' as PlaySpriteSheet,
	DRONE: 'DRONE' as PlaySpriteSheet,
	PNEU: 'PNEU' as PlaySpriteSheet,
	PASS_PASS: 'PASS_PASS' as PlaySpriteSheet,
	POWER_UP: 'POWER_UP' as PlaySpriteSheet,
	BUS_RELAY: 'BUS_RELAY' as PlaySpriteSheet,
};

export type SpriteSheetConfig = {
	path: string;
	columns: number;
	rows: number;
	spriteWidth: number;
	spriteHeight: number;
	columnsFrameMax: number;
	isStatic?: boolean;
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
	},
	PNEU: {
		path: '/assets/Pneu-crevee-explosion-spritesheet1.png',
		columns: 12,
		rows: 1,
		spriteWidth: 0,
		spriteHeight: 0,
		columnsFrameMax: 0,
		isStatic: true,
	},
	PASS_PASS: {
		path: '/assets/PassPass.png',
		columns: 6,
		rows: 3,
		spriteWidth: 63,
		spriteHeight: 54,
		columnsFrameMax: 6,
	},
	POWER_UP: {
		path: '/assets/PowerUp.png',
		columns: 1,
		rows: 1,
		spriteWidth: 28,
		spriteHeight: 28,
		columnsFrameMax: 1,
		isStatic: true,
	},
	BUS_RELAY: {
		path: '/assets/BusRelay.png',
		columns: 1,
		rows: 1,
		spriteWidth: 140,
		spriteHeight: 44,
		columnsFrameMax: 1,
		isStatic: true,
	},
};

export const AvatarRowMapping: Record<string, number> = {
	bleu: 4,
	orange: 2,
	violet: 0,
};
