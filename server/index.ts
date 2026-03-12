import http from 'http';
import { loadEnvFile } from 'node:process';
import { Server as IOServer } from 'socket.io';
loadEnvFile('.env');

const server = http.createServer((_req, res) => {
	res.statusCode = 200;
	const name = process.argv[2];
	res.setHeader('Content-Type', 'text/plain');
	res.end(`Think ${name}, think\n${process.env.PWD}`);
});
const port = process.env.PORT || 8080;

server.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});

const io = new IOServer(server, { cors: { origin: true } });
io.on('connection', _socket => {});
