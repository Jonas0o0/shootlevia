export interface Account {
	username: string;
	avatar: string;
}

export interface PlayerData {
	id: string;
	account: Account;
	x: number;
	y: number;
	width: number;
	height: number;
	score: number;
	isJumping: boolean;
	jumpTimer: number;
	jumpCooldown: number;
}

export interface BulletData {
	id: string;
	x: number;
	y: number;
	width: number;
	height: number;
	ownerId: string;
}

export interface EnemyData {
	id: string;
	x: number;
	y: number;
	width: number;
	height: number;
	health: number;
}

export interface GameState {
	players: PlayerData[];
	bullets: BulletData[];
	enemies: EnemyData[];
	time: number;
}
