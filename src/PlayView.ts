import View from './View.ts';

export default class PlayView extends View {
	private img: HTMLImageElement;
	private positionX: number = 0;
	private positionY: number = 0;
	private step: number = 25;

	constructor(element: Element) {
		super(element);
		this.img = element.querySelector('img') as HTMLImageElement;
		this.img.style.position = 'absolute';
		this.img.style.left = '0px';
		this.img.style.top = '0px';
	}

	show() {
		super.show();
		document.addEventListener('keydown', this.handleKeyDown.bind(this));
	}

	hide() {
		super.hide();
		document.removeEventListener('keydown', this.handleKeyDown.bind(this));
	}

	private handleKeyDown(event: KeyboardEvent) {
		switch (event.key) {
			case 'ArrowUp':
				this.positionY -= this.step;
				break;
			case 'ArrowDown':
				this.positionY += this.step;
				break;
			case 'ArrowLeft':
				this.positionX -= this.step;
				break;
			case 'ArrowRight':
				this.positionX += this.step;
				break;
			default:
				return;
		}
		this.updatePosition();
		event.preventDefault();
	}

	private updatePosition() {
		this.img.style.left = `${this.positionX}px`;
		this.img.style.top = `${this.positionY}px`;
	}
}