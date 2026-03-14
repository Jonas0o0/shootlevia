import http from 'http';
import express from 'express';
import { Server as IOServer } from 'socket.io';
import { loadEnvFile } from 'node:process';
import leaderboardRoutes from './routes/leaderboardRoutes.ts';
import { ServerGame } from './models/Game.ts';
import { Direction } from '../common/Direction.ts';

// Chargement des variables d'environnement
loadEnvFile('.env');

const app = express();
const port = process.env.PORT || 8080;

// Middlewares
app.use(express.json());

// Routes
app.use('/leaderboard', leaderboardRoutes);

// Serveur HTTP et Socket.io
const server = http.createServer(app);
const io = new IOServer(server, { cors: { origin: true } });

const game = new ServerGame();

io.on('connection', socket => {
	console.log('Client connected:', socket.id);

	// On pourrait recevoir les infos du joueur lors de la connexion
	socket.on('join', (data: { username: string; avatar: string }) => {
		game.addPlayer(socket.id, data.username, data.avatar);
	});

	socket.on('move', (directions: Direction[]) => {
		game.handlePlayerMove(socket.id, directions);
	});

	socket.on('jump', () => {
		game.handlePlayerJump(socket.id);
	});

	socket.on('disconnect', () => {
		console.log('Client disconnected:', socket.id);
		game.removePlayer(socket.id);
	});
});

// Broadcast de l'état du jeu toutes les 16ms (~60fps)
setInterval(() => {
	io.emit('gameState', game.getState());
}, 1000 / 60);

// Lancement du serveur
server.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});
