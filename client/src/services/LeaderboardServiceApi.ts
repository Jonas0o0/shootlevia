import type { LeaderboardServiceInterface } from './LeaderboardServiceInterface.ts';
import type { LeaderboardEntry } from '../../../common/LeaderboardEntry.ts';

export default class LeaderboardServiceApi implements LeaderboardServiceInterface {
	private entries: LeaderboardEntry[] = [];
	private listeners: ((entries: LeaderboardEntry[]) => void)[] = [];

	constructor() {
		this.fetchEntries();
	}

	/**
	 * Force une mise à jour des entrées
	 */
	public refresh(): void {
		this.fetchEntries();
	}

	private fetchEntries() {
		console.log('Fetch du leaderboard');
		fetch('http://localhost:8080/leaderboard')
			.then(response => response.json())
			.then((response: any) => {
				this.entries = response.data.map((entry: any) => ({
					joueur: entry.joueur,
					score: entry.score,
					date: new Date(entry.date).getTime(),
				}));
				this.notify();
			})
			.catch(error => console.error('Error fetching leaderboard:', error));
		this.notify();
	}

	getEntries(): LeaderboardEntry[] {
		this.fetchEntries();
		return this.entries;
	}

	addEntry(entry: LeaderboardEntry): void {
		console.log('addEntry leaderboard');
		fetch('http://localhost:8080/leaderboard', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(entry),
		})
			.then(() => {
				this.fetchEntries();
			})
			.catch(error => console.error('Error adding entry:', error));
	}

	onEntryChange(callback: (entries: LeaderboardEntry[]) => void): void {
		this.listeners.push(callback);
	}

	private notify() {
		this.listeners.forEach(listener => listener(this.entries));
	}
}