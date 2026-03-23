import type { LeaderboardServiceInterface } from './LeaderboardServiceInterface.ts';
import type { LeaderboardEntry } from '../../../common/LeaderboardEntry.ts';

/**
 * Cette classe permet de stoker des entrées du leaderboard en mémoire
 * @class {LeaderboardServiceMemory}
 *
 * @implements {LeaderboardServiceInterface}
 */
class LeaderboardServiceMemory implements LeaderboardServiceInterface {
	/**
	 * Tableau dans lequel sont stockées les entrées
	 */
	leaderboardEntries: LeaderboardEntry[] = [];

	addEntry(entry: LeaderboardEntry): void {
		this.leaderboardEntries.push(entry);
		this.notify();
	}

	getEntries(): LeaderboardEntry[] {
		return this.leaderboardEntries;
	}

	private onChangeListeners: ((entries: LeaderboardEntry[]) => void)[] = [];

	/**
	 * Permet a composant de s'inscrire comme observer
	 * @param callBack
	 */
	onEntryChange(callBack: (entries: LeaderboardEntry[]) => void): void {
		this.onChangeListeners.push(callBack);
	};

	/**
	 * Permet de notifier les observers du changement di nombre de vies
	 * @private
	 */
	private notify() {
		this.onChangeListeners.forEach(callBack => callBack(this.getEntries()));
	}
}

export default LeaderboardServiceMemory;
