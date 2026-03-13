import type { Account } from '../../common/types.ts';
import type { HitBox } from '../../common/HitBox.ts';
import type { Weapon } from '../Weapon.ts';
import type { Bonus } from '../Bonus.ts';
import { Direction } from '../../common/Direction.ts';

class Player {
	private joueur: Account;
	private jump: boolean = false;
	private hitbox: HitBox;
	private score: number;
	private weapons: Weapon[];
	private bonus: Bonus[];
	velocity: number;

	constructor(
		joueur: Account,
		x: number,
		y: number,
		width: number,
		height: number
	) {
		this.joueur = joueur;
		this.hitbox = { x, y, width, height };
		this.weapons = [
			{ nom: 'attaque de base', degat: 2, tier: 1, tierMin: 1, tierMax: 5 },
		];
		this.bonus = [{ nom: 'Passpass', time: 2, avantage: 'Invincibilité' }];
		this.score = 0;
		this.velocity = 2;
	}

	isJumping(): boolean {
		return this.jump;
	}

	getPostition(): HitBox {
		return this.hitbox;
	}

	getAccoutn(): Account {
		return this.joueur;
	}

	getScore(): number {
		return this.score;
	}

	addScore(score: number = 10): void {
		this.score += score;
	}

	getWeapon(): Weapon[] {
		return this.weapons;
	}

	getBonus(): Bonus[] {
		return this.bonus;
	}

	move(direction: Direction): void {
		switch (direction) {
			case Direction.Left:
				this.hitbox.x -= this.velocity;
				break;
			case Direction.Right:
				this.hitbox.x += this.velocity;
				break;
			case Direction.Up:
				this.hitbox.y -= this.velocity;
				break;
			case Direction.Down:
				this.hitbox.y += this.velocity;
		}
	}
}

export default Player;
