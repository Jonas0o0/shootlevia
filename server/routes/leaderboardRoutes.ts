import { Router } from 'express';
import { leaderboardService } from '../services/LeaderboardService.ts';
import type { LeaderboardEntry } from '../../common/LeaderboardEntry.ts';

const router = Router();

// GET leaderboard avec pagination
router.get('/', (req, res) => {
	try {
		const offset = Number(req.query.offset ?? 0);
		const limit = Number(req.query.limit ?? 20);

		const result = leaderboardService.getLeaderboard(offset, limit);
		res.json(result);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Impossible de lire le leaderboard' });
	}
});

// POST nouvelle entrée
router.post('/', (req, res) => {
	try {
		const newEntry: LeaderboardEntry = req.body;
		leaderboardService.addEntry(newEntry);

		res.status(201).json({
			message: 'Entry added',
			entry: newEntry,
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Impossible d’ajouter l’entrée' });
	}
});

export default router;
