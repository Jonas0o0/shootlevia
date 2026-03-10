import Router from './Router.ts';
import View from './View.ts';
import type { Route } from './types.ts';
import HomeView from './HomeView.ts';
import PlayView from './PlayView.ts';
import Game from './models/Game.ts';

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
const leaderboard = new View(document.querySelector('.fenetre .leaderboard')!);
const credit = new View(document.querySelector('.fenetre .credit')!);
const play = new PlayView(document.querySelector('.fenetre .play')!);

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
Router.setMenuElement(document.querySelector('.fenetre nav')!);

// enregistrement du bouton "Jouer" comme lien de navigation interne
Router.registerLinks(
	document.querySelector<HTMLAnchorElement>('.fenetre .home .playButton')!
);

// chargement de la vue initiale selon l'URL demandée par l'utilisateur.rice (Deep linking)
Router.navigate('/', true);
// gestion des boutons précédent/suivant du navigateur (History API)
window.onpopstate = () => Router.navigate(document.location.pathname, true);


const game = new Game();
setInterval(() => game.update(), 1000 / 60);
requestAnimationFrame(game.update);