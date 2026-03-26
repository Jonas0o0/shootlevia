export type EnemyType = 'PNEU' | 'DRONE';

export interface EnemyConfig {
	type: EnemyType;
	baseHealth: number;
	spawnProbability: number; // Probabilité relative de spawn
	scoreValue: number;
	damageOnHit: number; // Dégâts subis par l'ennemi par balle
}

export const EnemyConfigs: Record<EnemyType, EnemyConfig> = {
	PNEU: {
		type: 'PNEU',
		baseHealth: 160,
		spawnProbability: 0.3,
		scoreValue: 10,
		damageOnHit: 11,
	},
	DRONE: {
		type: 'DRONE',
		baseHealth: 30,
		spawnProbability: 0.7,
		scoreValue: 20,
		damageOnHit: 16,
	},
};
