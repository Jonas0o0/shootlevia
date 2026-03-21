import type View from './View.ts';

export interface Route {
	path: string;
	view: View;
	title: string;
}

export interface GameStats {
	time: number;
	score: number;
	enemyCount: number;
}
