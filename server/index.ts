import http from 'http';
import express from 'express';
import { Server as IOServer } from 'socket.io';
import { loadEnvFile } from 'node:process';
import leaderboardRoutes from './routes/leaderboardRoutes';

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

io.on('connection', socket => {
	console.log('Client connected:', socket.id);
});

// Lancement du serveur
server.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});
