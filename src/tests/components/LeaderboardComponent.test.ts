import { describe, it } from 'node:test';
import { Window } from 'happy-dom';
import LeaderboardServiceMemory from '../../services/LeaderboardServiceMemory.ts';
import assert from 'node:assert';
import { LeaderboardComponent } from '../../components/LeaderboardComponent.ts';

const window = new Window();
Object.defineProperty(global, 'document', {
	value: window.document,
	writable: true,
});
Object.defineProperty(global, 'window', {
	value: window,
	writable: true,
});

/**
 * Permet de nettoyer une chaîne HTML des tabulations et retours à la ligne
 * afin de comparer plus facilement l'égalité de deux chaînes.
 * @param htmlString la chaîne HTML à nettoyer
 * @return la chaîne nettoyée
 */
function sanitizeHtml(htmlString: string) {
	return htmlString
		.replaceAll(/[\n|\t]/g, '')
		.replaceAll(/\d{2}\/\d{2}\/\d{4}/g, 'DATE');
}

describe('render', () => {
	it('devrait retourner le bon format html', () => {
		const leaderboardRepo: LeaderboardServiceMemory = new LeaderboardServiceMemory();
		leaderboardRepo.addEntry({ joueur: 'Joueur1', score: 999, date: Date.now() });
		leaderboardRepo.addEntry({ joueur: 'Joueur2', score: 100, date: Date.now() });
		leaderboardRepo.addEntry({ joueur: 'Joueur3', score: 300, date: Date.now() });
		leaderboardRepo.addEntry({ joueur: 'Joueur4', score: 1000, date: Date.now() });

		const leaderboardElement = document.createElement('tbody');
		leaderboardElement.id = 'leaderboard';
		document.body.appendChild(leaderboardElement);
		new LeaderboardComponent(leaderboardRepo, '#leaderboard');
		const expectedHtml = sanitizeHtml('<tr><td></td><td>Joueur4</td><td>1000</td><td>DATE</td></tr><tr><td></td><td>Joueur1</td><td>999</td><td>DATE</td></tr><tr><td></td><td>Joueur3</td><td>300</td><td>DATE</td></tr><tr><td>4</td><td>Joueur2</td><td>100</td><td>DATE</td></tr>');

		assert.strictEqual(sanitizeHtml(leaderboardElement.innerHTML), expectedHtml);
		document.body.removeChild(leaderboardElement);
	});
});

describe('render plus de 10', () => {
	it('devrait retourner le bon format html des 10 meilleur joueur', () => {
		const leaderboardRepo: LeaderboardServiceMemory = new LeaderboardServiceMemory();
		leaderboardRepo.addEntry({ joueur: 'Joueur12', score: 6354, date: Date.now() });
		leaderboardRepo.addEntry({ joueur: 'PasLa', score: 20, date: Date.now() });
		leaderboardRepo.addEntry({ joueur: 'Joueur5', score: 3200, date: Date.now() });
		leaderboardRepo.addEntry({ joueur: 'Joueur4', score: 1000, date: Date.now() });
		leaderboardRepo.addEntry({ joueur: 'Joueur9', score: 735, date: Date.now() });
		leaderboardRepo.addEntry({ joueur: 'Joueur1', score: 999, date: Date.now() });
		leaderboardRepo.addEntry({ joueur: 'PasLA', score: 10, date: Date.now() });
		leaderboardRepo.addEntry({ joueur: 'Joueur3', score: 300, date: Date.now() });
		leaderboardRepo.addEntry({ joueur: 'Joueur7', score: 978, date: Date.now() });
		leaderboardRepo.addEntry({ joueur: 'Joueur10', score: 845, date: Date.now() });
		leaderboardRepo.addEntry({ joueur: 'Joueur11', score: 873, date: Date.now() });
		leaderboardRepo.addEntry({ joueur: 'Joueur8', score: 934, date: Date.now() });

		const leaderboardElement = document.createElement('tbody');
		leaderboardElement.id = 'leaderboard';
		document.body.appendChild(leaderboardElement);

		new LeaderboardComponent(leaderboardRepo, '#leaderboard');
		const expectedHtml = sanitizeHtml('<tr><td></td><td>Joueur12</td><td>6354</td><td>DATE</td></tr><tr><td></td><td>Joueur5</td><td>3200</td><td>DATE</td></tr><tr><td></td><td>Joueur4</td><td>1000</td><td>DATE</td></tr><tr><td>4</td><td>Joueur1</td><td>999</td><td>DATE</td></tr><tr><td>5</td><td>Joueur7</td><td>978</td><td>DATE</td></tr><tr><td>6</td><td>Joueur8</td><td>934</td><td>DATE</td></tr><tr><td>7</td><td>Joueur11</td><td>873</td><td>DATE</td></tr><tr><td>8</td><td>Joueur10</td><td>845</td><td>DATE</td></tr><tr><td>9</td><td>Joueur9</td><td>735</td><td>DATE</td></tr><tr><td>10</td><td>Joueur3</td><td>300</td><td>DATE</td></tr>');

		assert.strictEqual(sanitizeHtml(leaderboardElement.innerHTML), expectedHtml);
		document.body.removeChild(leaderboardElement);
	});
});

describe('Pattern Observeur - onEntryChange lors de addEntry', () => {
	it('devrait notifier les observers quand on ajoute une entrée', () => {
		const leaderboardRepo: LeaderboardServiceMemory = new LeaderboardServiceMemory();

		const leaderboardElement = document.createElement('tbody');
		leaderboardElement.id = 'leaderboard';
		document.body.appendChild(leaderboardElement);

		new LeaderboardComponent(leaderboardRepo, '#leaderboard');

		leaderboardRepo.addEntry({ joueur: 'Joueur1', score: 999, date: Date.now() });

		const htmlContent = leaderboardElement.innerHTML;
		assert.ok(htmlContent.includes('Joueur1'), 'Component should have rendered the new entry');
		assert.ok(htmlContent.includes('999'), 'Component should display the score');

		document.body.removeChild(leaderboardElement);
	});
});

describe('Pattern Observeur - plusieurs entrées dans le leaderboard', () => {
	it('devrait mettre à jour le composant quand plusieurs entrées sont ajoutées', () => {
		const leaderboardRepo: LeaderboardServiceMemory = new LeaderboardServiceMemory();

		const leaderboardElement = document.createElement('tbody');
		leaderboardElement.id = 'leaderboard';
		document.body.appendChild(leaderboardElement);

		new LeaderboardComponent(leaderboardRepo, '#leaderboard');

		leaderboardRepo.addEntry({ joueur: 'Joueur1', score: 999, date: Date.now() });
		leaderboardRepo.addEntry({ joueur: 'Joueur2', score: 500, date: Date.now() });
		leaderboardRepo.addEntry({ joueur: 'Joueur3', score: 1500, date: Date.now() });

		const htmlContent = leaderboardElement.innerHTML;
		assert.ok(htmlContent.includes('Joueur1'), 'Should display Joueur1');
		assert.ok(htmlContent.includes('Joueur2'), 'Should display Joueur2');
		assert.ok(htmlContent.includes('Joueur3'), 'Should display Joueur3');

		const joueur3Pos = htmlContent.indexOf('Joueur3');
		const joueur1Pos = htmlContent.indexOf('Joueur1');
		assert.ok(joueur3Pos < joueur1Pos, 'Joueur3 (score 1500) should appear before Joueur1 (score 999)');

		document.body.removeChild(leaderboardElement);
	});
});
