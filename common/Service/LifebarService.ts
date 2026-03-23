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
	private maxLife: number;

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
		this.notify();
	}

	/**
	 * Permet d'enlever une quantité de vie aux vies restantes
	 *
	 * @param amount Nombre de vie à enlever
	 */
	removeLife(amount: number): void {
		this.life = Math.max(0, this.life - Math.abs(amount));
		this.notify();
	}

	/**
	 * Permet de savoir s'il reste des vies au joueur
	 *
	 * @return true si le joueur est encore en vie
	 */
	isAlive(): boolean {
		return this.life > 0;
	}

	/**
	 * Listes des observers de la lifebar (leur callback)
	 * @private
	 */
	private onChangeListeners: ((amountOfLife: number) => void)[] = [];

	/**
	 * Permet au composant de s'inscrire comme observer
	 * @param callBack
	 */
	public onLifeChange(callBack: (amountOfLife: number) => void) {
		this.onChangeListeners.push(callBack);
	}

	/**
	 * Permet de notifier les observers du changement du nombre de vies
	 * @private
	 */
	private notify() {
		this.onChangeListeners.forEach(callBack => callBack(this.life));
	}

	public setMaxLife(amount: number): void {
		this.maxLife = amount;
	}

	public getMaxLife() {
		return this.maxLife;
	}
}
