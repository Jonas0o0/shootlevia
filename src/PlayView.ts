import View from './View.ts';

const canvas: HTMLCanvasElement = document.querySelector('.fenetre .play .play_canvas')!;
const ctx = canvas.getContext('2d')!;

export default class PlayView extends View {

	private img: HTMLImageElement;
    private spriteWidth: number = 0;
    private spriteHeight: number = 0;
    private hasError: boolean = false;
    private errorMessage: string = '';

    // La première case Colonne 0, Ligne 0 (Cycliste violet)
    private frameX: number = 0; 
    private frameY: number = 0; 

    private x: number = 50;
    private y: number = 50;

	constructor(element: Element) {
		super(element);
        
		this.img = new Image();
        // assure-toi que Player.png est dans public/image/Player.png
        this.img.src = '/public/assets/Player.png';
        
        this.img.onload = () => {
            // 7 colonnes * 6 lignes dans le spritesheet
            this.spriteWidth = this.img.width / 7;
            this.spriteHeight = this.img.height / 6;

            // Par défaut on affiche la première case (violet)
            this.frameX = 0;
            this.frameY = 0;

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
        this.draw();
	}

	hide() {
		super.hide();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
	}

    /**
     * Dessine une unique case du spritesheet sur le canvas
     */
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