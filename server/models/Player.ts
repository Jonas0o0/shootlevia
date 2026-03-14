import type { Account, PlayerData } from '../../common/types';
import { Direction } from '../../common/Direction';

export class ServerPlayer {
	public id: string;
	private account: Account;
	public x: number;
	public y: number;
	public width: number;
	public height: number;
	private score: number = 0;
	private velocity: number = 2;
	private jumping: boolean = false;
	private jumpTimer: number = 0;
	private jumpCooldown: number = 0;

	constructor(id: string, account: Account, x: number, y: number) {
		this.id = id;
		this.account = account;
		this.x = x;
		this.y = y;
		this.width = 74;
		this.height = 100;
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
		if (!this.jumping && this.jumpCooldown <= 0) {
			this.jumping = true;
			this.jumpTimer = 40;
		}
	}

	update(): void {
		if (this.jumping) {
			this.jumpTimer--;
			if (this.jumpTimer <= 0) {
				this.jumping = false;
				this.jumpCooldown = 20;
			}
		} else if (this.jumpCooldown > 0) {
			this.jumpCooldown--;
		}
	}

	addScore(amount: number = 10): void {
		this.score += amount;
	}

	toData(): PlayerData {
		return {
			id: this.id,
			account: this.account,
			x: this.x,
			y: this.y,
			width: this.width,
			height: this.height,
			score: this.score,
			isJumping: this.jumping,
			jumpTimer: this.jumpTimer,
			jumpCooldown: this.jumpCooldown,
		};
	}
}
