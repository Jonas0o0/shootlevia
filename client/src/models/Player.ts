import type { Account, PlayerData } from '../../../common/types.ts';
import type { HitBox } from '../../../common/HitBox.ts';
import type { Weapon } from '../Weapon.ts';
import { Direction } from '../../../common/Direction.ts';
import SpriteSheetService from '../services/SpriteSheetService.ts';
import {
	PlaySpriteSheet,
	SpriteSheetConfigs,
	AvatarRowMapping,
} from '../../../common/SpriteSheetConfig.ts';
import type { Frame } from '../Frame.ts';
import Bonus from './Bonus.ts';
import type { BonusType } from '../../../common/BonusType.ts';
import { LifebarService } from '../../../common/Service/LifebarService.ts';
import { LifebarComponent } from '../components/LifebarComponent.ts';

class Player {
	private joueur: Account;
	private jump: { jumping: boolean };
	private hitbox: HitBox;
	private weapons: Weapon[];
	private bonus: Bonus[];
	private baseRow: number;
	private velocity: number;
	private sprite: SpriteSheetService;
	public id: string = '';
	private hud: Element | null;
	private lastBonusList: string = '';
	private life: LifebarService;

	constructor(
		joueur: Account | null,
		x: number,
		y: number,
		element: Element | null = null
	) {
		if (joueur == null) {
			joueur = { username: 'temp', avatar: 'pedalBleu' };
		}
		this.joueur = joueur;
		this.weapons = [
			{ nom: 'attaque de base', degat: 2, tier: 1, tierMin: 1, tierMax: 5 },
		];
		this.bonus = [];
		this.velocity = 2;
		this.jump = { jumping: false };
		this.hud = element;
		this.life = new LifebarService();
		if (element) {
			new LifebarComponent(this.life, '.jeu-hud .lifebar');
		}

		this.baseRow =
			AvatarRowMapping[joueur.avatar] ?? AvatarRowMapping.pedalBleu;
		this.sprite = new SpriteSheetService(PlaySpriteSheet.PLAYER, this.baseRow);

		this.hitbox = {
			x: x,
			y: y,
			width: this.sprite.getWidth(),
			height: SpriteSheetConfigs.PLAYER.spriteHeight,
		};
	}

	updateFromData(data: PlayerData): void {
		this.hitbox.x = data.x;
		this.hitbox.y = data.y;
		//Pour Optti on fait pas un bete remplacment, on compra les de liste por suprimer et ajputer les différence
		const dataSet = new Set(data.bonus);
		const currentSet = new Set(this.bonus.map(b => b.type));

		// Supprimer
		this.bonus = this.bonus.filter(b => dataSet.has(b.type));

		// Ajouter
		data.bonus.forEach((bonus: BonusType) => {
			if (!currentSet.has(bonus)) {
				this.bonus.push(new Bonus(bonus));
			}
		});

		// Mise à jour visuelle (sprite row)
		if (data.isJumping != this.jump.jumping) {
			if (data.isJumping) {
				this.sprite.setRow(this.baseRow + 1);
			} else {
				this.sprite.setRow(this.baseRow);
			}
		}
		this.jump.jumping = data.isJumping;
		if (this.life) {
			if (data.life.life < this.life.life) {
				this.life.removeLife(this.life.life - data.life.life);
			}
		}
	}

	isJumping(): boolean {
		return this.jump.jumping;
	}

	getPostition(): HitBox {
		return this.hitbox;
	}

	getAccoutn(): Account {
		return this.joueur;
	}

	getWeapon(): Weapon[] {
		return this.weapons;
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

	draw(ctx: CanvasRenderingContext2D): void {
		let frame: Frame = this.sprite.getFrame();
		ctx.drawImage(
			frame.img,
			frame.x,
			frame.y,
			frame.width,
			frame.height,
			this.hitbox.x,
			this.hitbox.y,
			frame.width,
			frame.height
		);

		// Dessiner les effets des bonus sur le joueur
		this.bonus.forEach(b => {
			b.drawOnPlayer(ctx, this.hitbox.x, this.hitbox.y);
		});

		this.updateHUD();
	}

	private updateHUD(): void {
		if (!this.hud) return; //On veux afficher dans l'HUD que les bonus du joueur coté cleint pas ceux des autre joueur

		const currentBonusList = this.bonus.map(b => b.type.nom).join(',');
		if (currentBonusList === this.lastBonusList) return;

		this.lastBonusList = currentBonusList;
		this.hud.innerHTML = '';

		this.bonus.forEach(b => {
			b.drawInHUD(this.hud!);
		});
	}
}

export default Player;
