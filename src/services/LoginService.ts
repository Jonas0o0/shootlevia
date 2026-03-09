import type { Account } from '../types.ts';

export interface LoginService {
	isLoggedIn(): boolean;

	login(account: Account): void;

	logout(): void;

	getCurrentUser(): Account | null;

	checkCoookie(): Account | null;

	setCookie(account: Account): void;

	removeCookie(): void;
}
