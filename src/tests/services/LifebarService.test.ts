import { describe, it } from 'node:test';
import assert from 'node:assert';
import { LifebarService } from '../../services/LifebarService.ts';

describe('default constructeur', () => {
	it('il devrait avoir que 3 vie', () => {
		const lifebar = new LifebarService();
		assert.strictEqual(lifebar.life, 3);
	});
});

describe('constructeur avec un nombre de vie donné', () => {
	it('il devrait avoir 10 vie', () => {
		const lifebar = new LifebarService(10);
		assert.strictEqual(lifebar.life, 10);
	});
});

describe('constructeur accept pas les valeurs négatives et 0', () => {
	it('vue que valeur négative alors donne la valeur par default', () => {
		const lifebar = new LifebarService(-2);
		assert.strictEqual(lifebar.life, 3);
	});
});