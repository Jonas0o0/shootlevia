import { describe, it } from 'node:test';
import LeaderboardServiceMemory from '../../services/LeaderboardServiceMemory.ts';
import assert from 'node:assert';
import { LeaderboardComponent } from '../../components/LeaderboardComponent.ts';

/**
 * Permet de nettoyer une chaîne HTML des tabulations et retours à la ligne
 * afin de comparer plus facilement l'égalité de deux chaînes.
 * @param htmlString la chaîne HTML à nettoyer
 * @return la chaîne nettoyée
 */
function sanitizeHtml(htmlString: string) {
	return htmlString.replaceAll(/[\n|\t]/g, '');
}

describe('render', () => {
	it('devrait retourner le bon format html', () => {
		const leaderboardRepo: LeaderboardServiceMemory = new LeaderboardServiceMemory();
		leaderboardRepo.addEntry({ joueur: 'Joueur1', score: 999, date: Date.now() });
		leaderboardRepo.addEntry({ joueur: 'Joueur2', score: 100,  date: Date.now()});
		leaderboardRepo.addEntry({ joueur: 'Joueur3', score: 300,date: Date.now() });
		leaderboardRepo.addEntry({ joueur: 'Joueur4', score: 1000, date: Date.now() });

		const leaderboardComponent: LeaderboardComponent = new LeaderboardComponent();
		const expectedHtml = sanitizeHtml('<tr><td></td><td>Joueur4</td><td>1000</td><td>09/03/2026</td></tr><tr><td></td><td>Joueur1</td><td>999</td><td>09/03/2026</td></tr><tr><td></td><td>Joueur3</td><td>300</td><td>09/03/2026</td></tr><tr><td>4</td><td>Joueur2</td><td>100</td><td>09/03/2026</td></tr>');

		assert.strictEqual(sanitizeHtml(leaderboardComponent.render(leaderboardRepo.getEntries())), expectedHtml);
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

		const leaderboardComponent: LeaderboardComponent = new LeaderboardComponent();
		const expectedHtml = sanitizeHtml('<tr><td></td><td>Joueur12</td><td>6354</td><td>09/03/2026</td></tr><tr><td></td><td>Joueur5</td><td>3200</td><td>09/03/2026</td></tr><tr><td></td><td>Joueur4</td><td>1000</td><td>09/03/2026</td></tr><tr><td>4</td><td>Joueur1</td><td>999</td><td>09/03/2026</td></tr><tr><td>5</td><td>Joueur7</td><td>978</td><td>09/03/2026</td></tr><tr><td>6</td><td>Joueur8</td><td>934</td><td>09/03/2026</td></tr><tr><td>7</td><td>Joueur11</td><td>873</td><td>09/03/2026</td></tr><tr><td>8</td><td>Joueur10</td><td>845</td><td>09/03/2026</td></tr><tr><td>9</td><td>Joueur9</td><td>735</td><td>09/03/2026</td></tr><tr><td>10</td><td>Joueur3</td><td>300</td><td>09/03/2026</td></tr>');

		assert.strictEqual(sanitizeHtml(leaderboardComponent.render(leaderboardRepo.getEntries())), expectedHtml);
	});
});

