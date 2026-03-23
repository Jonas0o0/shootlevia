import fs from 'fs';
import path from 'path';
import type { LeaderboardEntry } from '../../common/LeaderboardEntry.ts';

export class LeaderboardService {
	private readonly leaderboardPath: string;

	constructor(customPath?: string) {
		this.leaderboardPath = customPath ?? path.resolve('./server/ressources/leaderboard.json');
	}

	/**
	 * Lit le fichier leaderboard.json et retourne son contenu.
	 */
	public getAllEntries(): LeaderboardEntry[] {
		try {
			const file = fs.readFileSync(this.leaderboardPath, 'utf-8');
			return JSON.parse(file);
		} catch (err) {
			console.error('Erreur lors de la lecture du leaderboard:', err);
			return [];
		}
	}

	/**
	 * Retourne une portion du leaderboard avec pagination.
	 */
	public getLeaderboard(offset: number, limit: number) {
		const data = this.getAllEntries();
		const result = data.slice(offset, offset + limit);

		return {
			offset,
			limit,
			total: data.length,
			data: result,
		};
	}

	/**
	 * Ajoute une nouvelle entrée, trie par score et sauvegarde.
	 */
	public addEntry(newEntry: LeaderboardEntry): void {
		const data = this.getAllEntries();
		data.push(newEntry);
		data.sort((a, b) => b.score - a.score);

		try {
			fs.writeFileSync(this.leaderboardPath, JSON.stringify(data, null, 2));
		} catch (err) {
			console.error('Erreur lors de la sauvegarde du leaderboard:', err);
			throw new Error('Impossible de sauvegarder l’entrée');
		}
	}
}

export const leaderboardService = new LeaderboardService();
