import Router from './Router.ts';
import View from './View.ts';
import type { Route } from './types.ts';
import HomeView from './HomeView.ts';
import LoginServiceMemory from './services/LoginServiceMemory.ts';
import PopupLoginView from './PopupLoginView.ts';
import { io } from 'socket.io-client';
import type { Socket } from 'socket.io-client';
import AssetLoaderService from './services/AssetLoaderService.ts';
import { SpriteSheetConfigs } from '../../common/SpriteSheetConfig.ts';

const loader = new View(document.querySelector('section.loader')!);

const socket: Socket = io(window.location.hostname + ':8080');
import PlayView from './PlayView.ts';
import Game from './models/Game.ts';
import Player from './models/Player.ts';

async function init() {
	// 1. Préchargement des assets
	const imagesToPreload = [
		SpriteSheetConfigs.PLAYER.path,
		SpriteSheetConfigs.DRONE.path,
		SpriteSheetConfigs.PNEU.path,
		SpriteSheetConfigs.PASS_PASS.path,
		// Ajoutez d'autres images si nécessaire
	];

	try {
		await AssetLoaderService.loadAll(imagesToPreload);
		console.log('Tous les assets ont été chargés');
	} catch (error) {
		console.error('Erreur lors du chargement des assets', error);
	}

	loader.hide();
	// 2. Initialisation du DOM et des vues
	// Auto-scroll vers la fenêtre de la borne au chargement
	const fenetre = document.querySelector<HTMLElement>('main.fenetre');
	if (fenetre) {
		fenetre.scrollIntoView({
			behavior: 'smooth',
			inline: 'center',
			block: 'center',
		});
	}

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

	const leaderboard = new View(
		document.querySelector('.fenetre .leaderboard')!
	);
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

	const hud = document.querySelector('.fenetre .play .jeu-hud')!;

	const routes: Route[] = [
		{ path: '/', view: homeView, title: 'ShootLévia' },
		{ path: '/leaderboard', view: leaderboard, title: 'LeaderBoar' },
		{ path: '/credit', view: credit, title: 'Crédit' },
		{ path: '/play', view: play, title: '' },
	];

	Router.routes = routes;
	Router.titleElement = document.querySelector('.fenetre .banner .title')!;
	Router.setMenuElement(menuElement);
	Router.registerLinks(
		document.querySelector<HTMLAnchorElement>('.fenetre .home .playButton')!
	);

	Router.navigate(window.location.pathname || '/', true);
	window.onpopstate = () => Router.navigate(document.location.pathname, true);

	play.launchGameCallback = () => {
		socket.emit('reset');
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		const joueur = new Player(loginService.accounts, 0, 0, hud);
		const game = new Game(socket, [joueur], 0, canvas, ctx);

		// On s'assure de n'avoir qu'une boucle à la fois
		// Pour simplifier, on se contente du lancement ici
		setInterval(() => game.update(), 1000 / 60);
		game.draw();
	};
}

// Lancement de l'application
init();
