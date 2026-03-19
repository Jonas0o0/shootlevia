import type { BonusType } from './BonusType.ts';
import type { LifebarService } from './Service/LifebarService.ts';

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
	isJumping: boolean;
	jumpTimer: number;
	jumpCooldown: number;
	bonus: BonusType[];
	life: LifebarService;
	isInvincible: boolean;
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
	type?: string;
	x: number;
	y: number;
	width: number;
	height: number;
}

export interface BonusData {
	id: string;
	type: BonusType;
	x: number;
	y: number;
}

export interface GameState {
	players: PlayerData[];
	bullets: BulletData[];
	enemies: EnemyData[];
	bonuses: BonusData[];
	time: number;
}
