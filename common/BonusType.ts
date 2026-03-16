import { PlaySpriteSheet } from '../client/src/SpriteSheetConfig.ts';

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
	},
} as const;

export type BonusType = (typeof BonusType)[keyof typeof BonusType];
