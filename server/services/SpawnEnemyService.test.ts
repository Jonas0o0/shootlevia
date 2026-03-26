import { describe, it } from 'node:test';
import assert from 'node:assert';
import { SpawnEnemyService } from './SpawnEnemyService.ts';

describe('SpawnEnemyService', () => {
    const difficultyCurve = 0.1;
    const service = new SpawnEnemyService(difficultyCurve);

    describe('calculateRespawnRate', () => {
        it('devrait retourner le taux de base au début (time = 0)', () => {
            const rate = service.calculateRespawnRate(0);
            assert.strictEqual(rate, 300);
        });

        it('devrait diminuer le taux de spawn quand le temps avance', () => {
            const rateAt1000 = service.calculateRespawnRate(1000);
            const rateAt2000 = service.calculateRespawnRate(2000);
            assert.ok(rateAt2000 < rateAt1000, 'Le taux de spawn devrait être plus bas (plus rapide) à 2000 qu\'à 1000');
        });

        it('ne devrait jamais descendre en dessous du minRespawnRate (30)', () => {
            const rateAtOneMillion = service.calculateRespawnRate(1000000);
            assert.strictEqual(rateAtOneMillion, 30);
        });
    });

    describe('Scaling logic (Speed and Health)', () => {
        // Comme ces méthodes sont privées, on teste indirectement via generateEnemy ou on vérifie les valeurs via des calculs manuels si on les rendait publiques.
        // Pour les tests, on peut utiliser des méthodes "hacky" pour accéder aux privés ou simplement tester les sorties de generateEnemy.
        
        it('devrait augmenter la vie des ennemis avec le temps', () => {
            // @ts-ignore - accès pour le test
            const healthDrone0 = service.calculateHealth(0, 'DRONE');
            // @ts-ignore - accès pour le test
            const healthDrone1000 = service.calculateHealth(1000, 'DRONE');
            
            assert.strictEqual(healthDrone0, 30);
            assert.ok(healthDrone1000 > 30, 'La vie du drone devrait augmenter');
            
            // @ts-ignore - accès pour le test
            const healthPneu0 = service.calculateHealth(0, 'PNEU');
            assert.strictEqual(healthPneu0, 160, 'La vie minimum du pneu devrait être 160');
        });

        it('devrait augmenter la vitesse des ennemis avec un cap', () => {
            // @ts-ignore - accès pour le test
            const speed0 = service.calculateSpeedMultiplier(0);
            // @ts-ignore - accès pour le test
            const speed1000 = service.calculateSpeedMultiplier(1000);
            // @ts-ignore - accès pour le test
            const speedMax = service.calculateSpeedMultiplier(1000000);

            assert.strictEqual(speed0, 1);
            assert.ok(speed1000 > 1, 'La vitesse devrait augmenter');
            assert.strictEqual(speedMax, 3.0, 'La vitesse devrait être cappée à 3.0');
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
