export type EnemyType = 'PNEU' | 'DRONE' | 'BUS_RELAY';

export interface EnemyConfig {
	type: EnemyType;
	baseHealth: number;
	spawnProbability: number; // Probabilité relative de spawn
	scoreValue: number;
}

export const EnemyConfigs: Record<EnemyType, EnemyConfig> = {
	PNEU: {
		type: 'PNEU',
		baseHealth: 100,
		spawnProbability: 0.3,
		scoreValue: 10,
	},
	DRONE: {
		type: 'DRONE',
		baseHealth: 20,
		spawnProbability: 0.7,
		scoreValue: 20,
	},
	BUS_RELAY: {
		type: 'BUS_RELAY',
		baseHealth: 500,
		spawnProbability: 0,
		scoreValue: 500,
	},
};
