import type { LeaderboardEntry } from '../models/LeaderboardEntry.ts';
import type LeaderboardServiceMemory from '../services/LeaderboardServiceMemory.ts';

/**
 * Classe qui permet de générer au format html le tableau du leaderboard
 */
export class LeaderboardComponent {

	/**
	 * Element du leaderboard
	 * @private
	 */
	private leaderboardElement: HTMLElement;

	/**
	 * Service observé pour mettre à jour le rendu
	 * @private
	 */
	private leaderboardService: LeaderboardServiceMemory;

	constructor(leaderboardService: LeaderboardServiceMemory, leaderboardElement: string) {
		this.leaderboardElement = document.querySelector(leaderboardElement)!;
		this.leaderboardService = leaderboardService;
		this.leaderboardService.onEntryChange((entries: LeaderboardEntry[]) => this.render(entries));
		this.render(this.leaderboardService.getEntries());
	}

	/**
	 * Génère le html du tableau leaderboard des dix premiers joueurs grace au score à partir d'une liste d'entrées.
	 *
	 * @param {LeaderboardEntry[]} entries - Tableau des joueurs qui ont joué au jeu
	 * @returns {string} HTML généré avec les lignes du tableau (<tr>...</tr>)
	 *
	 */
	public render(entries: LeaderboardEntry[]): void {
		entries = entries.sort((a: LeaderboardEntry, b: LeaderboardEntry) => b.score - a.score);

		let htmlGen: string = '';
		for (let i = 0; i < entries.length && i <= 9; i++) {
			htmlGen += `<tr><td>${i <= 2 ? '' : i + 1}</td><td>${entries[i].joueur}</td><td>${entries[i].score}</td><td>${new Date(entries[i].date).toLocaleDateString('fr-FR')}</td></tr>`;
		}

		this.leaderboardElement.innerHTML = htmlGen;
	}
}