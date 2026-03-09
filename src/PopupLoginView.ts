import View from './View.ts';
import type LoginServiceMemory from './services/LoginServiceMemory.ts';

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

		console.log(this.loginService);
		if (loginService.isLoggedIn()) {
			this.loginButton.innerHTML =
				'<img class="image_deconnexion" src="/image/logo_Deconnexion.png" alt="logo deconnexion">\nDéconnexion';
		} else {
			this.loginButton.innerHTML = 'Connexion';
		}

		this.element.addEventListener('submit', e => this.submitForm(e));
	}

	oppenPopup() {
		console.log('Popup oppen');
		if (this.loginService.isLoggedIn()) {
			this.loginService.logout();
			this.loginButton.innerHTML = 'Connexion';
		} else {
			this.show();
			this.loginButton.innerHTML =
				'<img class="image_deconnexion" src="/image/logo_Deconnexion.png" alt="logo deconnexion">\nDéconnexion';
		}
	}

	submitForm(e: Event) {
		e.preventDefault();
		const formData = new FormData(this.element as HTMLFormElement);
		const username = formData.get('username') as string;
		const avatar = formData.get('avatar') as string;
		this.loginService.login({ username, playerColor: avatar });
		this.hide();
	}
}

export default PopupLoginView;
