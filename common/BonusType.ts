import { PlaySpriteSheet } from './SpriteSheetConfig.ts';

export const BonusType = {
	Shield: {
		nom: 'PassPass',
		bonusType: 'SHIELD',
		sprite: PlaySpriteSheet.PASS_PASS,
		rows: {
			HUD: 0,
			MAP: 1,
			PLAYER: 2,
		},
		sheetSize: {
			HUD: {
				width: 37,
				height: 24,
			},
			MAP: {
				width: 63,
				height: 54,
			},
		},
	},
	WeaponUpgrade: {
		nom: 'PowerUp',
		bonusType: 'WEAPON_UPGRADE',
		sprite: PlaySpriteSheet.POWER_UP,
		rows: {
			HUD: 0,
			MAP: 0,
			PLAYER: 0,
		},
		sheetSize: {
			HUD: {
				width: 28,
				height: 28,
			},
			MAP: {
				width: 28,
				height: 28,
			},
		},
	},
} as const;

export type BonusType = (typeof BonusType)[keyof typeof BonusType];
