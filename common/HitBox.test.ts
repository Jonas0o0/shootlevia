import { describe, it } from 'node:test';
import assert from 'node:assert';
import { checkCollision, getCenter, getOverlap } from './HitBox.ts';
import type { HitBox } from './HitBox.ts';

describe('checkCollision', () => {
	it('devrait détecter lorsque les boîtes se chevauchent', () => {
		const box1: HitBox = { x: 0, y: 0, width: 10, height: 10 };
		const box2: HitBox = { x: 5, y: 5, width: 10, height: 10 };
		assert.strictEqual(checkCollision(box1, box2), true);
	});

	it('ne devrait pas détecter lorsque les boîtes sont séparées', () => {
		const box1: HitBox = { x: 0, y: 0, width: 10, height: 10 };
		const box2: HitBox = { x: 15, y: 15, width: 10, height: 10 };
		assert.strictEqual(checkCollision(box1, box2), false);
	});

	it('devrait détecter lorsqu’une boîte est contenue dans une autre', () => {
		const box1: HitBox = { x: 0, y: 0, width: 50, height: 50 };
		const box2: HitBox = { x: 10, y: 10, width: 10, height: 10 };
		assert.strictEqual(checkCollision(box1, box2), true);
	});

	it('ne devrait pas détecter lorsque les boîtes se touchent uniquement par les bords', () => {
		const box1: HitBox = { x: 0, y: 0, width: 10, height: 10 };
		const box2: HitBox = { x: 10, y: 0, width: 10, height: 10 };
		assert.strictEqual(checkCollision(box1, box2), false);
	});

	it('devrait détecter une collision pour des boîtes identiques', () => {
		const box: HitBox = { x: 10, y: 10, width: 20, height: 20 };
		assert.strictEqual(checkCollision(box, box), true);
	});

	it('devrait gérer correctement les coordonnées négatives', () => {
		const box1: HitBox = { x: -20, y: -20, width: 10, height: 10 };
		const box2: HitBox = { x: -15, y: -15, width: 10, height: 10 };
		assert.strictEqual(checkCollision(box1, box2), true);
	});
});

describe('getOverlap', () => {
	it('devrait retourner les bonnes valeurs de chevauchement pour des boîtes qui se croisent', () => {
		const box1: HitBox = { x: 0, y: 0, width: 10, height: 10 };
		const box2: HitBox = { x: 5, y: 2, width: 10, height: 10 };
		const overlap = getOverlap(box1, box2);
		assert.strictEqual(overlap.x, 5); // min(10-5, 15-0) = 5
		assert.strictEqual(overlap.y, 8); // min(10-2, 12-0) = 8
	});

	it('devrait être symétrique peu importe l\'ordre des paramètres', () => {
		const box1: HitBox = { x: 0, y: 0, width: 10, height: 10 };
		const box2: HitBox = { x: 5, y: 5, width: 10, height: 10 };
		assert.deepStrictEqual(getOverlap(box1, box2), getOverlap(box2, box1));
	});
});

describe('getCenter', () => {
	it('devrait retourner le centre exact d\'une boîte', () => {
		const box: HitBox = { x: 10, y: 20, width: 100, height: 50 };
		const center = getCenter(box);
		assert.strictEqual(center.x, 60); // 10 + 50
		assert.strictEqual(center.y, 45); // 20 + 25
	});

	it('devrait gérer les dimensions impaires (nombres flottants)', () => {
		const box: HitBox = { x: 0, y: 0, width: 5, height: 3 };
		const center = getCenter(box);
		assert.strictEqual(center.x, 2.5);
		assert.strictEqual(center.y, 1.5);
	});
});
