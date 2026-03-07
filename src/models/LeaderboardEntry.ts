/**
 * Représente une entrée du leaderboard.
 *
 * @interface LeaderboardEntry
 */
export interface LeaderboardEntry {
	/**
	 * Nom ou pseudonyme du joueur
	 * @type {string}
	 */
	joueur: string;

	/**
	 * Score du joueur
	 * @type {number}
	 */
	score: number;
}
