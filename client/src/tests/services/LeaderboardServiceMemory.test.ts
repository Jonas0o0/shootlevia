import LeaderboardServiceMemory from '../../services/LeaderboardServiceMemory.ts';
import type { LeaderboardEntry } from '../../models/LeaderboardEntry.ts';
import * as assert from 'node:assert';
import { describe, it } from 'node:test';

describe('addEntry et getEntries', () => {
	it('devrait retrouver le même objet', () => {
		const leaderboardMemory = new LeaderboardServiceMemory();
		const entry: LeaderboardEntry = { joueur: 'Test', score: 999, date: Date.now() };
		leaderboardMemory.addEntry(entry);

		assert.ok(leaderboardMemory.getEntries().includes(entry));
	});
});