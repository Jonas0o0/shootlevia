import type { LifebarService } from '../services/LifebarService.ts';

/**
 * Classe qui permet de générer l'HTML des coeurs dans la lifebar
 */
export class LifebarComponent {

	/**
	 * Element de la lifebar
	 * @private
	 */
	private lifebar: HTMLElement;

	/**
	 * Service observé pour mettre à jour le rendu
	 * @private
	 */
	private lifebarService: LifebarService;

	constructor(lifebarService: LifebarService, lifebar: string) {
		this.lifebar = document.querySelector(lifebar)!;
		this.lifebarService = lifebarService;
		this.lifebarService.onLifeChange((amountOfLife) => this.render(amountOfLife));
		this.render(this.lifebarService.life);
	}

	/**
	 * Génère le HTML des coeurs dans la lifebar quand mise à jour
	 *
	 * @param amountOfLife Quantité de vie restantes au joueur
	 */
	public render(amountOfLife: number): void {
		let htmlGen: string = '';
		for (let i = 0; i < amountOfLife; i++)
			htmlGen += `<img src="image/lifeBar/coeur-plein.png" alt="coeur de vie plein">`;
		this.lifebar.innerHTML = htmlGen;
	}
}