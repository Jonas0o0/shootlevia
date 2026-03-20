import { describe, it } from 'node:test';
import * as assert from 'node:assert';
import { ServerGame } from '../../models/Game.ts';
import { ServerEnemy } from '../../models/ServerEnemy.ts';

describe('Test nbEnemyKill', () => {
	it('devrait incrémenter enemyCount, countDrone et countPneu quand on tue des ennemis', () => {
		const game = new ServerGame();
		game.reset();

		// Ajout d'un joueur pour avoir une source de tir
		game.addPlayer('testPlayer', 'user', 'avatar', 800, 600);
		const player = (game as any).players.get('testPlayer');

		// Vérification initiale
		assert.strictEqual(game.getState().enemyCount, 0);
		assert.strictEqual((game as any).countDrone, 0);
		assert.strictEqual((game as any).countPneu, 0);

		// --- 1. Tir fatal sur un DRONE ---
		// On place l'ennemi en X=0, Y=0 avec 1 seul PV
		const drone = new ServerEnemy('d1', 'DRONE', 0, 0, 0, 0, 1);
		(game as any).enemies.push(drone);
		
		// On tire exactement au même endroit pour garantir la mort à l'update
		player.arme.shoot('testPlayer', 0, 0);
		game.update();

		// Les compteurs concernent le DRONE doivent augmenter
		assert.strictEqual(game.getState().enemyCount, 1);
		assert.strictEqual((game as any).countDrone, 1);

		// --- 2. Tir fatal sur un PNEU ---
		const pneu = new ServerEnemy('p1', 'PNEU', 0, 0, 0, 0, 1);
		(game as any).enemies.push(pneu);

		// On tire à nouveau au même endroit
		player.arme.shoot('testPlayer', 0, 0);
		game.update();

		// Les compteurs globaux et du PNEU doivent augmenter
		assert.strictEqual(game.getState().enemyCount, 2);
		assert.strictEqual((game as any).countDrone, 1);
		assert.strictEqual((game as any).countPneu, 1);
	});
});
