import Enemy from './models/Enemy.ts';

class EnemySpawner {
	private ctx: CanvasRenderingContext2D;
	private enemies: Enemy[] = [];

	constructor( ctx: CanvasRenderingContext2D) {
		this.ctx = ctx;
	}

	spawnEnemy(tx: number, ty: number): Enemy {
		const x = tx;
		const y = ty;
		const enemy = new Enemy( x, y);
		this.enemies.push(enemy);
		return enemy;
	}

	getEnemies() {
		return this.enemies;
	}

	updateAndDraw() {
		for (const enemy of this.enemies) {
			enemy.update();
			enemy.draw(this.ctx);
		}
	}
}

export default EnemySpawner;
