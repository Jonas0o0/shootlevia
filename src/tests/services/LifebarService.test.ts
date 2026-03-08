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

describe('addLife ajouter de la vie', () => {
	it('devrait renvoyer l addition des vies plus celle ajoutées', () => {
		const lifebar = new LifebarService(20);
		lifebar.life = 10;
		lifebar.addLife(3);
		assert.strictEqual(lifebar.life, 13);
	});
});

describe('addLife sans depasser le max', () => {
	it('devrait rendre le max de vie', () => {
		const lifebar = new LifebarService(20);
		lifebar.life = 10;
		lifebar.addLife(20);
		assert.strictEqual(lifebar.life, 20);
	});
});

describe('addLife mettre une valeur négative', () => {
	it('devrait devrait faire utilisé la valeur absolue de la valeur ajouté', () => {
		const lifebar = new LifebarService(5);
		lifebar.life = 1;
		lifebar.addLife(-2);
		assert.strictEqual(lifebar.life, 3);
	});
});

describe('removeLife enlever la bonne quantité de vie', () => {
	it('devrait rendre la vie restante moin la vie enlever', () => {
		const lifebar = new LifebarService(20);
		lifebar.removeLife(10);
		assert.strictEqual(lifebar.life, 10);
	});
});

describe('removeLife sans depasser 0', () => {
	it('devrait rentre 0 le min de vie', () => {
		const lifebar = new LifebarService(20);
		lifebar.removeLife(40);
		assert.strictEqual(lifebar.life, 0);
	});
});

