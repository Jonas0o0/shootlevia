/**
 * Cette classe permet de gérer une barre de vie
 * @class {LifebarService}
 */
export class LifebarService {

	/**
	 * Nombre de vies maximum
	 * @type {number}
	 * @private
	 */
	private readonly maxLife: number;

	/**
	 * Nombre de vies restantes au joueur
	 * @type {number}
	 */
	life: number;

	/**
	 * Constructeur de classe permet d'initialiser les variables maxLife et life
	 *
	 * @param amountOfLife Permet de choisir le nombre de vies max de la barre de vie
	 *
	 * Par default 3 vies
	 */
	constructor(amountOfLife: number = 3) {
		this.maxLife = amountOfLife <= 0 ? 3 : amountOfLife;
		this.life = amountOfLife <= 0 ? 3 : amountOfLife;
	}

	/**
	 * Permet d'ajouter une quantité de vie aux vies restantes
	 *
	 * @param amount Nombre de vie à ajouter
	 */
	addLife(amount: number): void {
		this.life = Math.min(this.maxLife, this.life + Math.abs(amount));
	}

}