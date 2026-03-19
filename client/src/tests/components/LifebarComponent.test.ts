import { describe, it } from 'node:test';
import { Window } from 'happy-dom';
import { LifebarService } from '../../../../common/Service/LifebarService.ts';
import { LifebarComponent } from '../../components/LifebarComponent.ts';
import assert from 'node:assert';

const window = new Window();
Object.defineProperty(global, 'document', {
	value: window.document,
	writable: true,
});
Object.defineProperty(global, 'window', {
	value: window,
	writable: true,
});

describe('render doit retourner le bon nombre de cœurs dans la lifebar', () => {
	it('devrait retourner la bonne chaîne HTML', () => {
		const lifebatElement = document.createElement('div');
		lifebatElement.id = 'lifebar';
		document.body.appendChild(lifebatElement);

		const lifebarService = new LifebarService();
		new LifebarComponent(lifebarService, '#lifebar');

		const imagesGen = lifebatElement.querySelectorAll('img');

		assert.strictEqual(imagesGen.length, lifebarService.life);
		document.body.removeChild(lifebatElement);
	});
});

describe('render doit retourner le bon nombre de cœurs dans la lifebar avec changement', () => {
	it('devrait retourner la bonne chaîne HTML', () => {
		const lifebatElement = document.createElement('div');
		lifebatElement.id = 'lifebar';
		document.body.appendChild(lifebatElement);

		const lifebarService = new LifebarService(10);
		new LifebarComponent(lifebarService, '#lifebar');

		assert.strictEqual(lifebatElement.querySelectorAll('img').length, 10);

		lifebarService.removeLife(5);
		assert.strictEqual(lifebatElement.querySelectorAll('img').length, 5);

		lifebarService.addLife(2);
		assert.strictEqual(lifebatElement.querySelectorAll('img').length, 7);

		document.body.removeChild(lifebatElement);
	});
});
