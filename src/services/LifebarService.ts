/**
 * Cette classe permet de gérer une barre de vie
 * @class {LifebarService}
 */
export class LifebarService {

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
		this.life = amountOfLife;
	}

}