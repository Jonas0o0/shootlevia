import Router from "./Router.ts";
import View from "./View.ts";
import type {Route} from "./types.ts";

// Auto-scroll vers la fenêtre de la borne au chargement
window.addEventListener('load', () => {
    const fenetre = document.querySelector<HTMLElement>('main.fenetre');
    if (fenetre) {
        fenetre.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'center' });
    }
});


// création des vues de notre application
const homeView = new View(document.querySelector('.fenetre .home')!);
const leaderboard = new View(document.querySelector('.fenetre .leaderboard')!);
const credit = new View(document.querySelector('.fenetre .credit')!);
const play = new View(document.querySelector('.fenetre .play')!);

const routes: Route[] = [
    { path: '/', view: homeView, title: 'ShootLévia' },
    { path: '/leaderboard', view: leaderboard, title: 'LeaderBoar' },
    { path: '/credit', view: credit, title: 'Crédit' },
    { path: '/play', view: play, title: '' },
];

Router.routes = routes;
// élément dans lequel afficher le <h1> de la vue
Router.titleElement = document.querySelector('.fenetre .title')!;
// gestion des liens du menu (détection du clic et activation/désactivation)
Router.setMenuElement(document.querySelector('.fenetre nav')!);

// chargement de la vue initiale selon l'URL demandée par l'utilisateur.rice (Deep linking)
Router.navigate('/', true);
// gestion des boutons précédent/suivant du navigateur (History API)
window.onpopstate = () => Router.navigate(document.location.pathname, true);


