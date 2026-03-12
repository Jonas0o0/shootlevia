import View from './View.ts';

const canvas: HTMLCanvasElement = document.querySelector('.fenetre .play .play_canvas')!;
const ctx = canvas.getContext('2d')!;

export default class PlayView extends View {

	private img: HTMLImageElement;
    private spriteWidth: number = 0;
    private spriteHeight: number = 0;
    private hasError: boolean = false;
    private errorMessage: string = '';

    private frameX: number = 0;
    private frameY: number = 0; //Colonne a changer pour modifier le personnage / l'animation

    private x: number = 50;
    private y: number = 50;

    private animationId: number | null = null;
    private animationFps: number = 8;
    private maxFrameX: number = 6;

	constructor(element: Element) {
		super(element);
        
		this.img = new Image();
        this.img.src = '/public/assets/Player.png';
        
        this.img.onload = () => {
            this.spriteWidth = this.img.width / 7;
            this.spriteHeight = this.img.height / 6;

            this.frameX = 0;
            this.frameY = 0; //Colonne a changer pour modifier le personnage / l'animation

            this.draw();
        };

        this.img.onerror = () => {
            this.hasError = true;
            this.errorMessage = 'Erreur: Player.png introuvable';
            console.error('[PlayView] impossible de charger Player.png');
            this.draw();
        };
	}

	show() {
		super.show();
        this.startAnimation();
	}

	hide() {
		super.hide();
        this.stopAnimation();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
	}

    private startAnimation() {
        if (this.animationId !== null || this.hasError) {
            return;
        }

        const tick = () => {
            this.frameX = (this.frameX + 1) % this.maxFrameX;
            this.draw();
            this.animationId = window.setTimeout(tick, 1000 / this.animationFps);
        };

        this.frameX = 0;
        this.draw();
        this.animationId = window.setTimeout(tick, 1000 / this.animationFps);
    }

    setRow(row: number) {
        if (row < 0 || row >= 6) {
            console.warn('[PlayView] ligne invalide', row);
            return;
        }
        this.frameY = row;
    }

    private stopAnimation() {
        if (this.animationId !== null) {
            window.clearTimeout(this.animationId);
            this.animationId = null;
        }
    }

    private draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (this.hasError) {
            ctx.fillStyle = '#900';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#fff';
            ctx.font = '24px sans-serif';
            ctx.fillText(this.errorMessage, 20, 40);
            return;
        }

        if (!this.img.complete || this.img.naturalWidth === 0) {
            ctx.fillStyle = '#333';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#fff';
            ctx.font = '24px sans-serif';
            ctx.fillText('Chargement...', 20, 40);
            return;
        }

        const frameW = this.spriteWidth || this.img.width;
        const frameH = this.spriteHeight || this.img.height;

        if (frameW <= 0 || frameH <= 0) {
            console.warn('[PlayView] dimensions spritesheet invalides', frameW, frameH);
            ctx.fillStyle = '#f00';
            ctx.fillRect(10, 10, 100, 100);
            return;
        }

        const srcX = this.frameX * frameW;
        const srcY = this.frameY * frameH;
        const srcW = Math.min(frameW, this.img.width - srcX);
        const srcH = Math.min(frameH, this.img.height - srcY);

        if (srcW <= 0 || srcH <= 0) {
            console.warn('[PlayView] zone source invalide (srcW/srcH)', srcW, srcH);
            return;
        }

        ctx.drawImage(
            this.img,
            srcX,
            srcY,
            srcW,
            srcH,
            this.x,
            this.y,
            this.spriteWidth || srcW,
            this.spriteHeight || srcH
        );
    }
}