import type { Route } from './types.ts';

/**
 * Classe Router qui permet de gérer la navigation dans l'application sans rechargement de page.
 * (Single Page Application)
 */
export default class Router {
	/**
	 * Tableau des routes/vues de l'application.
	 * @example `Router.routes = [{ path: '/help', view: helpView, title: 'Support' }]`
	 */
	static routes: Route[];
	static currentRoute: Route;

	static titleElement: Element;
	static #menuElement: Element; // propriété statique et privée (#...)

	/**
	 * Setter qui indique au `Router` la balise HTML contenant le menu de navigation.
	 * Écoute le clic sur chaque lien et déclenche la méthode `Router.navigate`.
	 * @param {Element} menuElement
	 * @see Router.handleMenuLinkClick
	 * @see Router.navigate
	 */
	static setMenuElement(menuElement: Element) {
		this.#menuElement = menuElement;
		// on écoute le clic sur tous les liens du menu
		const menuLinks = this.#menuElement.querySelectorAll('a');
		menuLinks.forEach(link =>
			link.addEventListener('click', (event: MouseEvent) => {
				event.preventDefault();
				const target = event.currentTarget as HTMLAnchorElement;
				// on récupère le href du lien cliqué pour déclencher navigate(...)
				const linkHref = target.getAttribute('href')!;
				Router.navigate(linkHref);
			})
		);
	}
	/**
	 * Enregistre un ou plusieurs liens comme liens de navigation interne.
	 * Au clic, le lien déclenche `Router.navigate` au lieu d'un rechargement de page.
	 * @param {HTMLAnchorElement[] | HTMLAnchorElement} links
	 */
	static registerLinks(links: HTMLAnchorElement[] | HTMLAnchorElement) {
		const list = Array.isArray(links) ? links : [links];
		list.forEach(link =>
			link.addEventListener('click', (event: MouseEvent) => {
				event.preventDefault();
				const target = event.currentTarget as HTMLAnchorElement;
				const linkHref = target.getAttribute('href')!;
				Router.navigate(linkHref);
			})
		);
	}

	/**
	 * Affiche la view correspondant à `path` dans le tableau `routes`
	 * @param {String} path URL de la page à afficher
	 * @param {Boolean} skipPushState active/désactive le pushState (gestion des boutons précédent/suivant du navigateur)
	 */
	static navigate(path: string, skipPushState = false) {
		const route = this.routes.find(route => route.path === path);
		if (route) {
			// on masque toutes les vues
			this.routes.forEach(r => r.view.hide());

			this.currentRoute = route;
			route.view.show();
			this.titleElement.innerHTML = `<h1>${route.title}</h1>`;

            // Activation/désactivation des liens du menu
            const previousMenuLink = this.#menuElement.querySelector('a.active'),
            newMenuLink = this.#menuElement.querySelector(`a[href="${path}"]:not(.logo_link)`);
            previousMenuLink?.classList.remove('active'); // on retire la classe "active" du précédent menu
            newMenuLink?.classList.add('active'); // on ajoute la classe CSS "active" sur le nouveau lien

			// History API : ajout d'une entrée dans l'historique du navigateur
			// pour pouvoir utiliser les boutons précédent/suivant
			if (!skipPushState) {
				window.history.pushState(null, '', path);
			}
		}
	}
}
