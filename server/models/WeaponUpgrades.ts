import { Direction } from '../../common/Direction.ts';

export const WeaponLevel = {
	LEVEL1: 0,
	LEVEL2: 1,
	LEVEL3: 2,
	LEVEL4: 3,
	LEVEL5: 4,
} as const;

export type WeaponLevel = (typeof WeaponLevel)[keyof typeof WeaponLevel];

export type WeaponStats = {
	vitesse: number;
	direction: Direction[];
	degat: number;
	frequence: number;
};

export const WeaponUpgrades: Record<WeaponLevel, WeaponStats> = {
	[WeaponLevel.LEVEL1]: {
		vitesse: 5,
		direction: [Direction.Right],
		degat: 10,
		frequence: 500,
	},
	[WeaponLevel.LEVEL2]: {
		vitesse: 8,
		direction: [Direction.Right],
		degat: 15,
		frequence: 300,
	},
	[WeaponLevel.LEVEL3]: {
		vitesse: 8,
		direction: [Direction.UR20, Direction.DR20],
		degat: 15,
		frequence: 300,
	},
	[WeaponLevel.LEVEL4]: {
		vitesse: 10,
		direction: [Direction.Right, Direction.UR20, Direction.DR20],
		degat: 20,
		frequence: 250,
	},
	[WeaponLevel.LEVEL5]: {
		vitesse: 12,
		direction: [Direction.Right, Direction.UR20, Direction.DR20, Direction.UR35, Direction.DR35],
		degat: 30,
		frequence: 150,
	},
};
