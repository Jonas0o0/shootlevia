import Router from './Router.ts';
import View from './View.ts';
import type { Route } from './types.ts';
import HomeView from './HomeView.ts';
import LoginServiceMemory from './services/LoginServiceMemory.ts';
import PopupLoginView from './PopupLoginView.ts';
import Game from './models/Game.ts';
import { io } from 'socket.io-client';
import type { Socket } from 'socket.io-client';
const socket: Socket = io(window.location.hostname + ':8080');
import PlayView from './PlayView.ts';

// Auto-scroll vers la fenêtre de la borne au chargement
window.addEventListener('load', () => {
	const fenetre = document.querySelector<HTMLElement>('main.fenetre');
	if (fenetre) {
		fenetre.scrollIntoView({
			behavior: 'smooth',
			inline: 'center',
			block: 'center',
		});
	}
});

// création des vues de notre application
const banner = document.querySelector('.fenetre .banner')!;
const background = document.querySelector('.fenetre .background')!;

const homeView = new HomeView(
	document.querySelector('.fenetre .home')!,
	background,
	banner
);

const menuElement = document.querySelector('.fenetre nav')!;
const loginButton = menuElement.querySelector('.btn_deconnexion')!;
const loginService: LoginServiceMemory = new LoginServiceMemory();

const leaderboard = new View(document.querySelector('.fenetre .leaderboard')!);
const credit = new View(document.querySelector('.fenetre .credit')!);
const canvas: HTMLCanvasElement = document.querySelector(
	'.fenetre .play .play_canvas'
)!;
const ctx = canvas.getContext('2d')!;
const play = new PlayView(
	document.querySelector('.fenetre .play')!,
	canvas,
	ctx
);

const popup = new PopupLoginView(
	document.querySelector('#popup')!,
	loginButton as HTMLElement,
	loginService
);

loginButton.addEventListener('click', () => {
	popup.oppenPopup();
});

const routes: Route[] = [
	{ path: '/', view: homeView, title: 'ShootLévia' },
	{ path: '/leaderboard', view: leaderboard, title: 'LeaderBoar' },
	{ path: '/credit', view: credit, title: 'Crédit' },
	{ path: '/play', view: play, title: '' },
];

Router.routes = routes;
// élément dans lequel afficher le <h1> de la vue
Router.titleElement = document.querySelector('.fenetre .banner .title')!;
// gestion des liens du menu (détection du clic et activation/désactivation)
Router.setMenuElement(menuElement);

// enregistrement du bouton "Jouer" comme lien de navigation interne
Router.registerLinks(
	document.querySelector<HTMLAnchorElement>('.fenetre .home .playButton')!
);

// chargement de la vue initiale selon l'URL demandée par l'utilisateur.rice (Deep linking)
Router.navigate('/', true);
// gestion des boutons précédent/suivant du navigateur (History API)
window.onpopstate = () => Router.navigate(document.location.pathname, true);

const game = new Game(socket, [], 0, ctx);
setInterval(() => game.update(), 1000 / 60);
requestAnimationFrame(game.update);
