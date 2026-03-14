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

export interface GameState {
	players: PlayerData[];
	bullets: BulletData[];
	time: number;
}
