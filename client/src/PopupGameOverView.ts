import View from './View.ts';

export default class PopupGameOverView extends View {
	replayBtn: HTMLButtonElement;
	leaveBtn: HTMLButtonElement;
	onReplay?: () => void;
	onQuit?: () => void;

	constructor(element: Element, onReplay?: () => void, onQuit?: () => void) {
		super(element);
		this.onReplay = onReplay;
		this.onQuit = onQuit;

		this.replayBtn = this.element.querySelector('.popupGameOver .replayBtn') as HTMLButtonElement;
		this.leaveBtn = this.element.querySelector('.popupGameOver .leaveBtn') as HTMLButtonElement;

		this.replayBtn.addEventListener('click', (e) => {
			e.preventDefault();
			this.hide();
			if (this.onReplay) this.onReplay();
		});

		this.leaveBtn.addEventListener('click', (e) => {
			e.preventDefault();
			this.hide();
			if (this.onQuit) this.onQuit();
		});
	}

	setCallbacks(onReplay: () => void, onQuit: () => void) {
		this.onReplay = onReplay;
		this.onQuit = onQuit;
	}
}

