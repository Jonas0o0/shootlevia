import type { Account, PlayerData } from '../../common/types.ts';
import { Direction } from '../../common/Direction.ts';
import { BonusType } from '../../common/BonusType.ts';
import { LifebarService } from '../../common/Service/LifebarService.ts';
import { Arme } from './Arme.ts';
import type { HitBox } from '../../common/HitBox.ts';

export class ServerPlayer implements HitBox {
	public id: string;
	private account: Account;

	public x: number;
	public y: number;
	public width: number;
	public height: number;
	private canvasWidth: number;
	private canvasHeight: number;
	private velocity: number = 2;
	private jumping: boolean = false;
	private jumpTimer: number = 0;
	private jumpCooldown: number = 30;
	private life: LifebarService;
	private bonus: BonusType[];
	private invincibilityTimer: number = 0;
	private readonly INVINCIBILITY_DURATION: number = 60;
	public arme: Arme;
	public score: number = 0;

	constructor(
		id: string,
		account: Account,
		x: number,
		y: number,
		life: number,
		canvasWidth: number,
		canvasHeight: number
	) {
		this.id = id;
		this.account = account;
		this.x = x;
		this.y = y;
		this.width = 74;
		this.height = 100;
		this.canvasWidth = canvasWidth;
		this.canvasHeight = canvasHeight;
		this.bonus = [];
		this.life = new LifebarService(life);
		this.arme = new Arme(10, [Direction.Right], 1, 1);
		this.score = 0;
	}

	public getAccount(): Account {
		return this.account;
	}

	public static clamp(value: number, min: number, max: number): number {
		return Math.max(min, Math.min(value, max));
	}

	move(direction: Direction): void {
		switch (direction) {
			case Direction.Left:
				this.x -= this.velocity;
				break;
			case Direction.Right:
				this.x += this.velocity;
				break;
			case Direction.Up:
				this.y -= this.velocity;
				break;
			case Direction.Down:
				this.y += this.velocity;
				break;
		}

		this.x = ServerPlayer.clamp(this.x, 0, this.canvasWidth - this.width);
		this.y = ServerPlayer.clamp(
			this.y,
			this.canvasHeight * 0.2 - 45,
			this.canvasHeight - this.height
		);
	}

	moveByVector(vx: number, vy: number): void {
		this.x += vx;
		this.y += vy;

		this.x = ServerPlayer.clamp(this.x, 0, this.canvasWidth - this.width);
		this.y = ServerPlayer.clamp(
			this.y,
			this.canvasHeight * 0.2 - 45,
			this.canvasHeight - this.height
		);
	}

	public static calculateDamageOutcome(
		currentBonuses: any[],
		invincibilityTimer: number
	): { shouldTakeLife: boolean; newBonuses: any[] } {
		if (invincibilityTimer > 0) {
			return { shouldTakeLife: false, newBonuses: currentBonuses };
		}

		const hasShield = currentBonuses.some(b => b.nom === BonusType.Shield.nom);

		if (hasShield) {
			return {
				shouldTakeLife: false,
				newBonuses: currentBonuses.filter(b => b.nom !== BonusType.Shield.nom),
			};
		}

		return { shouldTakeLife: true, newBonuses: currentBonuses };
	}

	doJump(): void {
		if (!this.jumping && this.jumpTimer <= 0) {
			this.jumping = true;
			this.jumpTimer = this.jumpCooldown;
		}
	}

	update(): void {
		if (!this.life.isAlive()) return;

		this.arme.autoShoot(this.id, this);
		if (this.jumping) {
			this.jumpTimer--;
			if (this.jumpTimer <= 0) {
				this.jumping = false;
			}
		}
		if (this.invincibilityTimer > 0) {
			this.invincibilityTimer--;
		}
	}

	takeDamage(): boolean {
		if (!this.life.isAlive()) return false;

		const previousBonusCount = this.bonus.length;

		const { shouldTakeLife, newBonuses } = ServerPlayer.calculateDamageOutcome(
			this.bonus,
			this.invincibilityTimer
		);

		this.bonus = newBonuses;

		if (!shouldTakeLife) {
			if (this.bonus.length < previousBonusCount) {
				this.invincibilityTimer = this.INVINCIBILITY_DURATION;
			}
			return false;
		}

		this.life.removeLife(1);

		this.invincibilityTimer = this.INVINCIBILITY_DURATION;
		return !this.life.isAlive();
	}

	addBonus(bonus: BonusType): void {
		if (bonus.nom === BonusType.WeaponUpgrade.nom) {
			this.arme.levelUp();
		} else {
			if (!this.bonus.includes(bonus)) {
				this.bonus.push(bonus);
			}
		}
	}

	public getIsJumping(): boolean {
		return this.jumping;
	}

	public isAlive(): boolean {
		return this.life.isAlive();
	}

	public reset(): void {
		this.life = new LifebarService();
		this.bonus = [];
		this.invincibilityTimer = 0;
		this.x = 100;
		this.y = 300;
		this.arme.bullets = [];
	}

	shoot(): void {
		if (!this.life.isAlive()) return;
		this.arme.shoot(this.id, this);
	}

	toData(): PlayerData {
		return {
			id: this.id,
			account: this.account,
			x: this.x,
			y: this.y,
			width: this.width,
			height: this.height,
			isJumping: this.jumping,
			jumpTimer: this.jumpTimer,
			jumpCooldown: this.jumpCooldown,
			bonus: this.bonus,
			life: { life: this.life.life, maxLife: this.life.getMaxLife() } as any,
			isInvincible: this.invincibilityTimer > 0,
			score: this.score,
		};
	}
}
