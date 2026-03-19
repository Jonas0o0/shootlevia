import type { Account, PlayerData } from '../../common/types.ts';
import { Direction } from '../../common/Direction.ts';
import { BonusType } from '../../common/BonusType.ts';
import { LifebarService } from '../../common/Service/LifebarService.ts';

export class ServerPlayer {
	public id: string;
	private account: Account;

	public x: number;
	public y: number;
	public width: number;
	public height: number;
	private velocity: number = 2;
	private jumping: boolean = false;
	private jumpTimer: number = 0;
	private jumpCooldown: number = 30;
	private life: LifebarService;
	private bonus: BonusType[];
	private invincibilityTimer: number = 0;
	private readonly INVINCIBILITY_DURATION: number = 60;

	constructor(id: string, account: Account, x: number, y: number) {
		this.id = id;
		this.account = account;
		this.x = x;
		this.y = y;
		this.width = 74;
		this.height = 100;
		this.bonus = [];
		this.life = new LifebarService();
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
	}

	doJump(): void {
		if (!this.jumping && this.jumpTimer <= 0) {
			this.jumping = true;
			this.jumpTimer = this.jumpCooldown;
		}
	}

	update(): void {
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

	takeDamage(): void {
		if (this.invincibilityTimer > 0) return;

		const hasShield = this.bonus.includes(BonusType.Shield);

		if (hasShield) {
			this.bonus = this.bonus.filter(bonus => bonus !== BonusType.Shield);
		} else {
			this.life.removeLife(1);
		}

		this.invincibilityTimer = this.INVINCIBILITY_DURATION;
	}

	addBonus(bonus: BonusType): void {
		if (!this.bonus.includes(bonus)) {
			this.bonus.push(bonus);
		}
	}

	public getIsJumping(): boolean {
		return this.jumping;
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
			life: this.life,
			isInvincible: this.invincibilityTimer > 0,
		};
	}
}
