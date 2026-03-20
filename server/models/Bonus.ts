import type { BonusType } from '../../common/BonusType.ts';
import type { BonusData } from '../../common/types.ts';

class ServerBonus {
	public id: string;
	public type: BonusType;
	public x: number;
	public y: number;
	public width: number;
	public height: number;
	private speed: number = -(0.4 * (1000 / 60)); // Vitesse de la map

	constructor(id: string, type: BonusType, x: number, y: number) {
		this.id = id;
		this.type = type;
		this.x = x;
		this.y = y;
		this.width = type.sheetSize.MAP.width;
		this.height = type.sheetSize.MAP.height;
	}

	update(): void {
		this.x += this.speed;
	}

	toData(): BonusData {
		return {
			id: this.id,
			type: this.type,
			x: this.x,
			y: this.y,
		};
	}
}

export default ServerBonus;
