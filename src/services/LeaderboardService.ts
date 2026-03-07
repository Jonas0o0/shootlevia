import type { LeaderboardEntry } from '../models/LeaderboardEntry.ts';

/**
 * Interface qui regis les règles pour devenir un moyen de stocker des leaderEntry
 *
 * @interface LeaderboardService
 */
export interface LeaderboardService {

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
}