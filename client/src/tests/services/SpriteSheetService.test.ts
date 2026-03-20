import { describe, it } from 'node:test';
import assert from 'node:assert';
import SpriteSheetService from '../../services/SpriteSheetService.ts';

describe('SpriteSheetService', () => {
    describe('calculateFrameIndex', () => {
        it('devrait incrémenter le tick et garder la même frame si on n\'a pas atteint la vitesse d\'animation', () => {
            const { nextFrame, nextTick } = SpriteSheetService.calculateFrameIndex(0, 0, 5, 4);
            assert.strictEqual(nextFrame, 0);
            assert.strictEqual(nextTick, 1);
        });

        it('devrait passer à la frame suivante et remettre le tick à 0 quand on atteint la vitesse d\'animation', () => {
            const { nextFrame, nextTick } = SpriteSheetService.calculateFrameIndex(0, 4, 5, 4);
            assert.strictEqual(nextFrame, 1);
            assert.strictEqual(nextTick, 0);
        });

        it('devrait revenir à la frame 0 quand on dépasse le nombre max de colonnes', () => {
            const { nextFrame, nextTick } = SpriteSheetService.calculateFrameIndex(3, 4, 5, 4);
            assert.strictEqual(nextFrame, 0);
            assert.strictEqual(nextTick, 0);
        });
    });

    describe('calculateSourceCoords', () => {
        it('devrait retourner les bonnes coordonnées sources (srcX, srcY)', () => {
            const coords = SpriteSheetService.calculateSourceCoords(2, 1, 64, 64);
            assert.strictEqual(coords.srcX, 128);
            assert.strictEqual(coords.srcY, 64);
        });
    });
});
