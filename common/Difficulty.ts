export const Difficulty = {
	Facile: {
		life: 5,
		difficultyCurve: 0.3,
	},
	Moyen: {
		life: 5,
		difficultyCurve: 0.5,
	},
	Difficile: {
		life: 3,
		difficultyCurve: 0.5,
	},
} as const;

export type Difficulty = (typeof Difficulty)[keyof typeof Difficulty];
