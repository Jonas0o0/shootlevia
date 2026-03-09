import type { LeaderboardEntry } from '../models/LeaderboardEntry.ts';

/**
 * Classe qui permet de générer au format html le tableau du leaderboard
 */
export class LeaderboardComponent {

	/**
	 * Génère le html du tableau leaderboard des dix premiers joueurs grace au score à partir d'une liste d'entrées.
	 *
	 * @param {LeaderboardEntry[]} entries - Tableau des joueurs qui ont joué au jeu
	 * @returns {string} HTML généré avec les lignes du tableau (<tr>...</tr>)
	 *
	 */
	public render(entries: LeaderboardEntry[]): string {
		entries = entries.sort((a: LeaderboardEntry, b: LeaderboardEntry) => b.score - a.score);

		let htmlGen: string = '';
		for (let i = 0; i < entries.length && i <= 9; i++) {
			htmlGen += `<tr><td>${i <= 2 ? '' : i + 1}</td><td>${entries[i].joueur}</td><td>${entries[i].score}</td><td>${new Date(entries[i].date).toLocaleDateString('fr-FR')}</td></tr>`;
		}

		return htmlGen;
	}
}