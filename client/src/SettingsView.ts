import View from './View.ts';
import type LoginServiceMemory from './services/LoginServiceMemory.ts';
import { DeplacementType } from './models/DeplacementType.ts';

class SettingsView extends View {
	loginService: LoginServiceMemory;
	onSettingsChanged?: () => void;

	constructor(
		element: HTMLElement,
		loginService: LoginServiceMemory,
		onSettingsChanged?: () => void
	) {
		super(element);
		this.loginService = loginService;
		this.onSettingsChanged = onSettingsChanged;

		this.element.addEventListener('submit', e => this.submitForm(e));
	}

	show() {
		super.show();
		this.fillForm();
	}

	private fillForm() {
		if (this.loginService.isLoggedIn()) {
			const user = this.loginService.getCurrentUser()!;
			const form = this.element.querySelector('form') as HTMLFormElement;

			const usernameInput = form.querySelector(
				'input[name="username"]'
			) as HTMLInputElement;
			if (usernameInput) usernameInput.value = user.username;

			const avatarValue = user.avatar.replace('pedal', '').toLowerCase();
			const avatarInput = form.querySelector(
				`input[name="avatar"][value="${avatarValue}"]`
			) as HTMLInputElement;
			if (avatarInput) avatarInput.checked = true;

			const deplacementValue =
				user.deplacement === DeplacementType.Mouse ? 'mouse' : 'keyboard';
			const deplacementInput = form.querySelector(
				`input[name="deplacement"][value="${deplacementValue}"]`
			) as HTMLInputElement;
			if (deplacementInput) deplacementInput.checked = true;
		}
	}

	private submitForm(e: Event) {
		e.preventDefault();

		const form = e.target as HTMLFormElement;
		const formData = new FormData(form);
		const avatar = formData.get('avatar') as string;
		const deplacement = formData.get('deplacement') as string;

		const deplacementType =
			deplacement === 'mouse'
				? DeplacementType.Mouse
				: DeplacementType.Keyboard;

		if (this.loginService.accounts) {
			this.loginService.login({
				username: this.loginService.accounts.username,
				avatar: avatar,
				deplacement: deplacementType,
			});
		}

		if (this.onSettingsChanged) {
			this.onSettingsChanged();
		}

		alert('Paramètres enregistrés !');
	}
}

export default SettingsView;
