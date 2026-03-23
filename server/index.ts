import http from 'http';
import express from 'express';
import { Server as IOServer } from 'socket.io';
import { loadEnvFile } from 'node:process';
import leaderboardRoutes from './routes/leaderboardRoutes.ts';
import { ServerGame } from './models/Game.ts';
import { Direction } from '../common/Direction.ts';
import type { Difficulty } from '../common/Difficulty.ts';

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

const games = new Map<string, ServerGame>();
const socketRoomMap = new Map<string, string>();

io.on('connection', socket => {
	console.log('Client connected:', socket.id);

	socket.on('create_lobby', (difficulty: Difficulty) => {
		const roomId = Math.random().toString(36).substring(2, 7).toUpperCase();
		const game = new ServerGame(io, roomId, difficulty);
		games.set(roomId, game);

		joinRoom(socket, roomId);
		socket.emit('lobby_created', roomId);
		console.log(`Lobby Created: ${roomId} by ${socket.id}`);
	});

	socket.on('join_lobby', (inputRoomId: string) => {
		const roomId = inputRoomId.toUpperCase();
		if (games.has(roomId)) {
			joinRoom(socket, roomId);
			socket.emit('lobby_joined', { success: true, roomId });
			console.log(`Client ${socket.id} joined lobby ${roomId}`);
		} else {
			socket.emit('lobby_joined', {
				success: false,
				error: 'Lobby introuvable',
			});
		}
	});

	function joinRoom(socket: any, roomId: string) {
		const currentRoom = socketRoomMap.get(socket.id);
		if (currentRoom) {
			socket.leave(currentRoom);
			const game = games.get(currentRoom);
			if (game) game.removePlayer(socket.id);
		}

		socket.join(roomId);
		socketRoomMap.set(socket.id, roomId);

		updateLobbyList(roomId);
	}

	function updateLobbyList(roomId: string) {
		const room = io.sockets.adapter.rooms.get(roomId);
		if (room) {
			io.to(roomId).emit('lobby_update', { count: room.size });
		}
	}

	socket.on('start_match', () => {
		const roomId = socketRoomMap.get(socket.id);
		if (roomId) {
			const game = games.get(roomId);
			if (game) game.reset();

			io.to(roomId).emit('match_started');
		}
	});

	socket.on('reset', () => {
		const game = getGame(socket.id);
		if (game) game.reset();
	});

	socket.on(
		'join',
		(data: {
			username: string;
			avatar: string;
			canvasWidth: number;
			canvasHeight: number;
			difficulty: Difficulty;
		}) => {
			const game = getGame(socket.id);
			if (game) {
				game.addPlayer(
					socket.id,
					data.username,
					data.avatar,
					data.canvasWidth,
					data.canvasHeight
				);
			} else {
				const roomId = `SOLO_${socket.id}`;
				const newGame = new ServerGame(io, roomId, data.difficulty);
				games.set(roomId, newGame);
				joinRoom(socket, roomId);
				newGame.addPlayer(
					socket.id,
					data.username,
					data.avatar,
					data.canvasWidth,
					data.canvasHeight
				);
			}
		}
	);

	socket.on('move', (directions: Direction[]) => {
		const game = getGame(socket.id);
		if (game) game.handlePlayerMove(socket.id, directions);
	});

	socket.on('jump', () => {
		const game = getGame(socket.id);
		if (game) game.handlePlayerJump(socket.id);
	});

	socket.on('leave', () => {
		const game = getGame(socket.id);
		if (game) {
			game.removePlayer(socket.id);
			checkEmptyGame(socketRoomMap.get(socket.id)!);
		}
	});

	socket.on('disconnect', () => {
		console.log('Client disconnected:', socket.id);
		const game = getGame(socket.id);
		if (game) {
			game.removePlayer(socket.id);
			checkEmptyGame(socketRoomMap.get(socket.id)!);
		}
		socketRoomMap.delete(socket.id);
	});

	function getGame(socketId: string) {
		const roomId = socketRoomMap.get(socketId);
		if (roomId) return games.get(roomId);
		return null;
	}

	function checkEmptyGame(roomId: string) {
		const room = io.sockets.adapter.rooms.get(roomId);
		if (!room || room.size === 0) {
			const game = games.get(roomId);
			if (game) {
				game.stop();
				games.delete(roomId);
				console.log(`Lobby ${roomId} closed (empty)`);
			}
		}
	}
});

// Lancement du serveur
server.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});
