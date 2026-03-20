import View from './View.ts';
import type LoginServiceMemory from './services/LoginServiceMemory.ts';
import { DeplacementType } from './models/DeplacementType.ts';

class PopupLoginView extends View {
	loginButton: HTMLElement;
	loginService: LoginServiceMemory;

	constructor(
		element: HTMLElement,
		loginButton: HTMLElement,
		loginService: LoginServiceMemory
	) {
		super(element);
		this.loginButton = loginButton;
		this.loginService = loginService;

		this.updateButton();

		this.element.addEventListener('submit', e => this.submitForm(e));
	}

	private updateButton() {
		if (this.loginService.isLoggedIn()) {
			const user = this.loginService.getCurrentUser()!;
			this.loginButton.innerHTML =
				`<span class="user-info">` +
				`<img class="user-avatar" src="/image/pedal${user.avatar.toUpperCase().charAt(0)}${user.avatar.substring(1)}.gif" alt="avatar">` +
				`<span class="user-pseudo">${user.username}</span>` +
				`</span>` +
				`<span class="deconnexion-info">` +
				`<img class="image_deconnexion" src="/image/logo_Deconnexion.png" alt="logo deconnexion">` +
				`Déconnexion` +
				`</span>`;
			this.loginButton.classList.add('logged-in');
		} else {
			this.loginButton.innerHTML = 'Connexion';
			this.loginButton.classList.remove('logged-in');
		}
	}

	oppenPopup() {
		if (this.loginService.isLoggedIn()) {
			this.loginService.logout();
			this.updateButton();
		} else {
			this.show();
		}
	}

	submitForm(e: Event) {
		e.preventDefault();

		const formData = new FormData(this.element as HTMLFormElement);
		const username = (formData.get('username') as string).trim();
		const avatar = formData.get('avatar') as string;
		const deplacement = formData.get('deplacement') as string;
		console.log('Avatar sélectionné :', avatar);

		if (username.length === 0) {
			alert('Le pseudo est obligatoire.');
			return;
		}

		if (!/^[a-zA-Z0-9_-]{3,15}$/.test(username)) {
			alert(
				'Pseudo invalide.\n\n' +
					'Le pseudo doit contenir entre 3 et 15 caractères et peut uniquement inclure :\n' +
					'• des lettres (a-z, A-Z)\n' +
					'• des chiffres (0-9)\n' +
					'• un tiret (-) ou un underscore (_)'
			);
			return;
		}

		console.log(deplacement);
		let deplacementType;
		if (deplacement === 'mouse') {
			deplacementType = DeplacementType.Mouse;
		} else if (deplacement === 'keyboard') {
			deplacementType = DeplacementType.Keyboard;
		} else {
			deplacementType = DeplacementType.Keyboard;
		}

		this.loginService.login({
			username,
			avatar: avatar,
			deplacement: deplacementType,
		});
		this.hide();
		this.updateButton();
	}
}

export default PopupLoginView;
