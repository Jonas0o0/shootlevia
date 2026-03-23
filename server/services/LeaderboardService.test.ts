import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { LeaderboardService } from './LeaderboardService.ts';
import type { LeaderboardEntry } from '../../common/LeaderboardEntry.ts';

describe('LeaderboardService', () => {
    const testFilePath = path.resolve('./server/ressources/leaderboard_test.json');
    let service: LeaderboardService;

    before(() => {
        // S'assurer que le dossier existe
        const dir = path.dirname(testFilePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        // Créer un fichier de test vide
        fs.writeFileSync(testFilePath, JSON.stringify([], null, 2));
        service = new LeaderboardService(testFilePath);
    });

    after(() => {
        // Nettoyer le fichier de test
        if (fs.existsSync(testFilePath)) {
            fs.unlinkSync(testFilePath);
        }
    });

    it('devrait être initialement vide', () => {
        const entries = service.getAllEntries();
        assert.strictEqual(entries.length, 0);
    });

    it('devrait ajouter une entrée et la sauvegarder', () => {
        const entry: LeaderboardEntry = { joueur: 'Player1', score: 100, date: Date.now() };
        service.addEntry(entry);
        
        const entries = service.getAllEntries();
        assert.strictEqual(entries.length, 1);
        assert.strictEqual(entries[0].joueur, 'Player1');
        assert.strictEqual(entries[0].score, 100);
    });

    it('devrait trier les entrées par score décroissant', () => {
        const entryHigh: LeaderboardEntry = { joueur: 'Pro', score: 500, date: Date.now() };
        const entryLow: LeaderboardEntry = { joueur: 'Noob', score: 10, date: Date.now() };
        
        service.addEntry(entryLow);
        service.addEntry(entryHigh);
        
        const entries = service.getAllEntries();
        assert.strictEqual(entries[0].joueur, 'Pro');
        assert.strictEqual(entries[1].joueur, 'Player1'); // Déjà ajouté dans le test précédent
        assert.strictEqual(entries[2].joueur, 'Noob');
    });

    it('devrait gérer la pagination (getLeaderboard)', () => {
        const result = service.getLeaderboard(0, 2);
        assert.strictEqual(result.data.length, 2);
        assert.strictEqual(result.total, 3);
        assert.strictEqual(result.offset, 0);
        assert.strictEqual(result.limit, 2);
    });
});
