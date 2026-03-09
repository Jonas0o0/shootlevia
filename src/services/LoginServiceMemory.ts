import type { Account } from '../types.ts';
import type { LoginService } from './LoginService.ts';

class LoginServiceMemory implements LoginService {
	accounts: Account | null;

	constructor() {
		this.accounts = this.checkCoookie();
	}

	isLoggedIn(): boolean {
		if (this.accounts) {
			return true;
		}
		return false;
	}

	login(account: Account): void {
		this.accounts = account;
		this.setCookie(account);
	}
	logout(): void {
		this.accounts = null;
	}
	getCurrentUser(): Account | null {
		return this.accounts;
	}
	checkCoookie(): Account | null {
		const cookie = document.cookie
			.split(';')
			.find(cookie => cookie.trim().startsWith('account='));
		if (cookie) {
			const accountString = cookie.split('=')[1];
			return JSON.parse(accountString);
		}
		return null;
	}
	setCookie(account: Account): void {
		const accountString = JSON.stringify(account);
		document.cookie = `account=${accountString}; path=/;`;
	}
}

export default LoginServiceMemory;
