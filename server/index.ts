import http from 'http';
import express from 'express';
import { Server as IOServer } from 'socket.io';
import type { LeaderboardEntry } from '../common/LeaderboardEntry';
import fs from 'fs';
import path from 'path';
import { loadEnvFile } from 'node:process';

loadEnvFile('.env');

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json()); // permet de lire le body JSON

const server = http.createServer(app);

const io = new IOServer(server, { cors: { origin: true } });

io.on('connection', socket => {
	console.log('Client connected:', socket.id);
});

const leaderboardPath = path.resolve('./ressources/leaderboar.json');

// GET leaderboard
app.get('/leaderboard', (req, res) => {
	try {
		const offset = Number(req.query.offset ?? 0);
		const limit = Number(req.query.limit ?? 20);

		const file = fs.readFileSync(leaderboardPath, 'utf-8');
		const data: LeaderboardEntry[] = JSON.parse(file);

		const result = data.slice(offset, offset + limit);

		res.json({
			offset,
			limit,
			total: data.length,
			data: result,
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Impossible de lire le leaderboard' });
	}
});

// POST leaderboard
app.post('/leaderboard', (req, res) => {
	try {
		const newEntry: LeaderboardEntry = req.body;

		const file = fs.readFileSync(leaderboardPath, 'utf-8');
		const data: LeaderboardEntry[] = JSON.parse(file);

		// ajout de l'entrée
		data.push(newEntry);

		// tri par score décroissant
		data.sort((a, b) => b.score - a.score);

		// sauvegarde
		fs.writeFileSync(leaderboardPath, JSON.stringify(data, null, 2));

		res.status(201).json({
			message: 'Entry added',
			entry: newEntry,
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Impossible d’ajouter l’entrée' });
	}
});

server.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});
