import { describe, it } from 'node:test';
import assert from 'node:assert';
import { checkCollision } from './HitBox.ts';
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
});
