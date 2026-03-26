import type View from './View.ts';

export interface Route {
	path: string;
	view: View;
	title: string;
}

export interface PlayerScore {
	username: string;
	score: number;
}

export interface GameStats {
	time: number;
	score: number;
	enemyCount: number;
	leaderboard?: PlayerScore[];
}
