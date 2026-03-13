import type { Account } from '../../common/types.ts';
import type { LoginService } from './LoginService.ts';

class LoginServiceMemory implements LoginService {
	accounts: Account | null;

	constructor() {
		this.accounts = this.checkCookie();
	}

	isLoggedIn(): boolean {
		return !!this.accounts;
	}

	login(account: Account): void {
		this.accounts = account;
		this.setCookie(account);
	}
	logout(): void {
		this.accounts = null;
		this.removeCookie();
	}
	getCurrentUser(): Account | null {
		return this.accounts;
	}
	checkCookie(): Account | null {
		const cookie = document.cookie
			.split(';')
			.find(cookie => cookie.trim().startsWith('account='));
		if (cookie) {
			const accountString = cookie.split('=')[1];
			try {
				return JSON.parse(decodeURIComponent(accountString));
			} catch (e) {
				console.error('Erreur lors du parse du cookie account', e);
				return null;
			}
		}
		return null;
	}
	setCookie(account: Account): void {
		const accountString = encodeURIComponent(JSON.stringify(account));
		document.cookie = `account=${accountString}; path=/; SameSite=Lax`;
	}

	removeCookie(): void {
		document.cookie = `account=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax`;
	}
}

export default LoginServiceMemory;
