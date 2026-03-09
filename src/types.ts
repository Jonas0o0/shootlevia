import type View from './View.ts';

export interface Route {
	path: string;
	view: View;
	title: string;
}

export interface Account {
	username: string;
	playerColor: string;
}
