import { describe, it } from 'node:test';
import assert from 'node:assert';
import { ServerPlayer } from './Player.ts';
import { BonusType } from '../../common/BonusType.ts';

describe('ServerPlayer', () => {
	describe('clamp', () => {
		it('devrait garder la valeur si elle est dans les bornes', () => {
			assert.strictEqual(ServerPlayer.clamp(50, 0, 100), 50);
		});

		it('devrait retourner le min si la valeur est trop basse', () => {
			assert.strictEqual(ServerPlayer.clamp(-10, 0, 100), 0);
		});

		it('devrait retourner le max si la valeur est trop haute', () => {
			assert.strictEqual(ServerPlayer.clamp(150, 0, 100), 100);
		});
	});

	describe('calculateDamageOutcome', () => {
		it('ne devrait pas prendre de dégâts si le joueur est invincible', () => {
			const outcome = ServerPlayer.calculateDamageOutcome(
				[BonusType.Shield],
				10
			);
			assert.strictEqual(outcome.shouldTakeLife, false);
			assert.deepStrictEqual(outcome.newBonuses, [BonusType.Shield]);
		});

		it('devrait consommer le bouclier et ne pas perdre de vie si un bouclier est présent', () => {
			const outcome = ServerPlayer.calculateDamageOutcome(
				[BonusType.Shield],
				0
			);
			assert.strictEqual(outcome.shouldTakeLife, false);
			assert.ok(
				!outcome.newBonuses.includes(BonusType.Shield),
				'Le bouclier devrait être supprimé'
			);
		});

		it("devrait perdre une vie si aucun bouclier n'est présent", () => {
			const outcome = ServerPlayer.calculateDamageOutcome([], 0);
			assert.strictEqual(outcome.shouldTakeLife, true);
			assert.deepStrictEqual(outcome.newBonuses, []);
		});
	});

	describe('movements', () => {
		const canvasWidth = 1920;
		const canvasHeight = 1080;
		const createPlayer = () =>
			new ServerPlayer('1', { username: 'test', avatar: 'bleu' }, 100, 300, 3);

		it('devrait se déplacer par vecteur correctement', () => {
			const player = createPlayer();
			player.moveByVector(10, -5);
			assert.strictEqual(player.x, 110);
			assert.strictEqual(player.y, 295);
		});

		it('devrait être limité par les bords du canvas (X)', () => {
			const player = createPlayer();
			player.moveByVector(-1000, 0);
			assert.strictEqual(player.x, 0);
			player.moveByVector(2000, 0);
			assert.strictEqual(player.x, canvasWidth - player.width);
		});

		it('devrait être limité par les bords du canvas (Y)', () => {
			const player = createPlayer();
			// Limite haute : canvasHeight * 0.2 - 45
			player.moveByVector(0, -1000);
			assert.strictEqual(player.y, canvasHeight * 0.2 - 45);

			player.moveByVector(0, 2000);
			assert.strictEqual(player.y, canvasHeight - player.height);
		});
	});
});
