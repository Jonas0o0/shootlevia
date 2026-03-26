import Router from './Router.ts';
import View from './View.ts';
import type { GameStats, Route } from './types.ts';
import HomeView from './HomeView.ts';
import LoginServiceMemory from './services/LoginServiceMemory.ts';
import PopupLoginView from './PopupLoginView.ts';
import PopupGameOverView from './PopupGameOverView.ts';
import SettingsView from './SettingsView.ts';
import type { Socket } from 'socket.io-client';
import { io } from 'socket.io-client';
import AssetLoaderService from './services/AssetLoaderService.ts';
import { SpriteSheetConfigs } from '../../common/SpriteSheetConfig.ts';
import PlayView from './PlayView.ts';
import Game from './models/Game.ts';
import Player from './models/Player.ts';
import PopupLobbyView from './PopupLobbyView.ts';
import LeaderboardServiceApi from './services/LeaderboardServiceApi.ts';
import { LeaderboardComponent } from './components/LeaderboardComponent.ts';

const loader = new View(document.querySelector('section.loader')!);

const socket: Socket = io(window.location.hostname + ':8080');

async function init() {
	// 1. Préchargement des assets
	const imagesToPreload = [
		SpriteSheetConfigs.PLAYER.path,
		SpriteSheetConfigs.DRONE.path,
		SpriteSheetConfigs.PNEU.path,
		SpriteSheetConfigs.PASS_PASS.path,
		SpriteSheetConfigs.POWER_UP.path,
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
	const settingsButton = menuElement.querySelector(
		'.btn_parametres'
	) as HTMLElement;
	const loginService: LoginServiceMemory = new LoginServiceMemory();

	const leaderboard = new View(
		document.querySelector('.fenetre .leaderboard')!
	);
	const leaderboardService = new LeaderboardServiceApi();
	new LeaderboardComponent(leaderboardService, '.fenetre .leaderboard tbody');
	document
		.querySelector("a[href='/leaderboard']")
		?.addEventListener('click', event => {
			event.preventDefault();
			leaderboardService.refresh();
		});

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

	const updateSettingsButtonVisibility = () => {
		if (loginService.isLoggedIn()) {
			settingsButton.style.display = 'block';
		} else {
			settingsButton.style.display = 'none';
		}
	};

	const settings = new SettingsView(
		document.querySelector('.fenetre .settings')!,
		loginService,
		() => {
			popup.updateButton();
			updateSettingsButtonVisibility();
		}
	);

	const popup = new PopupLoginView(
		document.querySelector('#popup')!,
		loginButton as HTMLElement,
		loginService,
		() => updateSettingsButtonVisibility()
	);

	const popupLobby = new PopupLobbyView(
		document.querySelector('#lobbypopup')!,
		socket
	);

	const multiBtn = document.querySelector('#multiBtn');
	if (multiBtn) {
		multiBtn.addEventListener('click', e => {
			e.preventDefault();
			if (!loginService.isLoggedIn()) {
				alert("Veuillez vous connecter d'abord !");
				popup.oppenPopup();
				return;
			}
			popupLobby.show();
		});
	}

	let game: Game | null = null;
	const popupGameOver = new PopupGameOverView(
		document.querySelector('.popupGameOver')!,
		() => {
			if (game) game.stop();
			play.launchGameCallback!();
		},
		() => {
			if (game) game.stop();
			Router.navigate('/');
		}
	);

	updateSettingsButtonVisibility();

	loginButton.addEventListener('click', () => {
		popup.oppenPopup();
	});

	const hud = document.querySelector('.fenetre .play .jeu-hud')!;

	const routes: Route[] = [
		{ path: '/', view: homeView, title: 'ShootLévia' },
		{ path: '/leaderboard', view: leaderboard, title: 'LeaderBoard' },
		{ path: '/credit', view: credit, title: 'Crédit' },
		{ path: '/play', view: play, title: '' },
		{ path: '/settings', view: settings, title: 'Paramètres' },
	];

	Router.routes = routes;
	Router.titleElement = document.querySelector('.fenetre .banner .title')!;
	Router.setMenuElement(menuElement);

	const playButton = document.querySelector<HTMLAnchorElement>(
		'.fenetre .home .playButton'
	)!;
	playButton.addEventListener('click', event => {
		event.preventDefault();
		if (!loginService.isLoggedIn()) {
			alert("Veuillez vous connecter d'abord !");
			popup.show();
			return;
		}
		popupLobby.show(true);
	});
	//Router.registerLinks(playButton);

	const quitButton = document.querySelector('.quit-game-btn')!;
	quitButton.addEventListener('click', event => {
		event.preventDefault();
		if (game) game.stop();
		socket.emit('leave');
		Router.navigate('/');
	});

	Router.navigate(window.location.pathname || '/', true);
	window.onpopstate = () => Router.navigate(document.location.pathname, true);

	play.launchGameCallback = () => {
		if (game) game.stop();
		socket.emit('reset');
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		const joueur = new Player(loginService.accounts, 0, 0, hud);
		game = new Game(
			socket,
			[joueur],
			0,
			canvas,
			ctx,
			popupLobby.getDifficulty(),
			(stats: GameStats) => {
				popupGameOver.setStats(stats);
				popupGameOver.show();
			}
		);

		game.start();
	};
}

// Lancement de l'application
init();
