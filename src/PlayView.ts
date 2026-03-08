import View from './View.ts';

export default class PlayView extends View {

	private img: HTMLImageElement;
	private positionX: number = 0;
	private positionY: number = 0;
	private speed: number = 5;
	private keysPressed: Set<string> = new Set();
	private animationFrameId: number | null = null;



	constructor(element: Element) {
		super(element);
		this.img = element.querySelector('img') as HTMLImageElement;
		this.img.style.position = 'absolute';
		this.img.style.left = '0px';
		this.img.style.top = '0px';
	}

	/* Lorsque la vue est affichée, on ajoute les écouteurs d'événements pour les touches du clavier et on démarre l'animation */
	show() {
		super.show();
		document.addEventListener('keydown', this.handleKeyDown.bind(this));
		document.addEventListener('keyup', this.handleKeyUp.bind(this));
		this.startAnimation();
	}

	/* Lorsque la vue est cachée, on arrête l'animation et on réinitialise les touches pressées */
	hide() {
		super.hide();
		document.removeEventListener('keydown', this.handleKeyDown.bind(this));
		document.removeEventListener('keyup', this.handleKeyUp.bind(this));
		this.stopAnimation();
		this.keysPressed.clear();
	}

	/**
	 * Gère l'événement de pression d'une touche
	 * Ajoute la touche pressée à l'ensemble des touches actuellement appuyées
	 */
	private handleKeyDown(event: KeyboardEvent) {
		if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
			this.keysPressed.add(event.key);
			event.preventDefault();
		}
	}

	/**
	 * Gère la libération des touches fléchées en les retirant de l'ensemble des touches actuellement appuyées
	 */
	private handleKeyUp(event: KeyboardEvent) {
		if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
			this.keysPressed.delete(event.key);
			event.preventDefault();
		}
	}

	/**
	 * Démarre la boucle d'animation qui met à jour la position du GIF à chaque frame
	 */
	private startAnimation() {
		const animate = () => {
			this.updatePosition();
			this.animationFrameId = requestAnimationFrame(animate);
		};
		this.animationFrameId = requestAnimationFrame(animate);
	}

	/**
	 * Arrête la boucle d'animation
	 */
	private stopAnimation() {
		if (this.animationFrameId !== null) {
			cancelAnimationFrame(this.animationFrameId);
			this.animationFrameId = null;
		}
	}

	/**
	 * Met à jour la position du GIF basée sur les touches actuellement appuyées
	 * Cette méthode est appelée à chaque frame (60 fois par seconde)
	 */
	private updatePosition() {
		if (this.keysPressed.has('ArrowUp')) {
			this.positionY -= this.speed;
		}
		if (this.keysPressed.has('ArrowDown')) {
			this.positionY += this.speed;
		}
		if (this.keysPressed.has('ArrowLeft')) {
			this.positionX -= this.speed;
		}
		if (this.keysPressed.has('ArrowRight')) {
			this.positionX += this.speed;
		}
		this.img.style.left = `${this.positionX}px`;
		this.img.style.top = `${this.positionY}px`;
	}
}