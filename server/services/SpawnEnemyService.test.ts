import { describe, it } from 'node:test';
import assert from 'node:assert';
import { SpawnEnemyService } from './SpawnEnemyService.ts';

describe('SpawnEnemyService', () => {
    const service = new SpawnEnemyService();

    describe('calculateRespawnRate', () => {
        it('devrait retourner le taux de base au début (time = 0)', () => {
            const rate = service.calculateRespawnRate(0);
            assert.strictEqual(rate, 300);
        });

        it('devrait diminuer le taux de spawn quand le temps avance', () => {
            const rateAt1000 = service.calculateRespawnRate(1000);
            const rateAt5000 = service.calculateRespawnRate(5000);
            assert.ok(rateAt5000 < rateAt1000, 'Le taux de spawn devrait être plus bas (plus rapide) à 5000 qu\'à 1000');
        });

        it('ne devrait jamais descendre en dessous du minRespawnRate (30)', () => {
            const rateAtOneMillion = service.calculateRespawnRate(1000000);
            assert.strictEqual(rateAtOneMillion, 30);
        });
    });

    describe('getEnemyType', () => {
        it('devrait retourner PNEU si la valeur aléatoire est < 0.3', () => {
            assert.strictEqual(service.getEnemyType(0.1), 'PNEU');
            assert.strictEqual(service.getEnemyType(0.29), 'PNEU');
        });

        it('devrait retourner DRONE si la valeur aléatoire est >= 0.3', () => {
            assert.strictEqual(service.getEnemyType(0.3), 'DRONE');
            assert.strictEqual(service.getEnemyType(0.9), 'DRONE');
        });
    });
});
