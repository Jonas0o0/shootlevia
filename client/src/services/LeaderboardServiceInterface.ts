import type { LeaderboardEntry } from '../../../common/LeaderboardEntry.ts';

/**
 * Interface qui regis les règles pour devenir un moyen de stocker des leaderEntry
 *
 * @interface LeaderboardServiceInterface
 */
export interface LeaderboardServiceInterface {
	/**
	 * Permet de récupérer tous les leaderEntry
	 * @return {LeaderboardEntry[]}
	 */
	getEntries(): LeaderboardEntry[];

	/**
	 * Permet d'ajouter une entrée dans le tableau
	 * @param leaderboardEntry
	 */
	addEntry(leaderboardEntry: LeaderboardEntry): void;

	/**
	 * Permet a composant de s'inscrire comme observer
	 * @param callBack
	 */
	onEntryChange(callBack: (entries: LeaderboardEntry[]) => void): void;
}
