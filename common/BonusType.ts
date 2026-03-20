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
} as const;

export type BonusType = (typeof BonusType)[keyof typeof BonusType];
