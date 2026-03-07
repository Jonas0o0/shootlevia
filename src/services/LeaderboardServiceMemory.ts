import type { LeaderboardService } from './LeaderboardService.ts';
import type { LeaderboardEntry } from '../models/LeaderboardEntry.ts';

/**
 * Cette classe permet de stoker des entrées du leaderboard en mémoire
 * @class {LeaderboardServiceMemory}
 *
 * @implements {LeaderboardService}
 */
class LeaderboardServiceMemory implements LeaderboardService {

	/**
	 * Tableau dans lequel sont stockées les entrées
	 */
	leaderboardEntries: LeaderboardEntry[] = [];

	addEntry(entry: LeaderboardEntry): void {
		this.leaderboardEntries.push(entry);
	}

	getEntries(): LeaderboardEntry[] {
		return this.leaderboardEntries;
	}
}

export default LeaderboardServiceMemory;