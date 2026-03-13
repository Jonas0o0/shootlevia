import View from './View.ts';
import { PlaySpriteSheet, SpriteSheetConfigs } from './SpriteSheetConfig.ts';

const canvas: HTMLCanvasElement = document.querySelector('.fenetre .play .play_canvas')!;
const ctx = canvas.getContext('2d')!;

export default class PlayView extends View {

	private img: HTMLImageElement;
	private spriteWidth: number = 0;
	private spriteHeight: number = 0;
	private spriteCols: number = 0;
	private spriteRows: number = 0;
	private hasError: boolean = false;
	private errorMessage: string = '';
	private resizeListener: ()=>void;

	private frameX: number = 0;
	private frameY: number = 0; // ligne à changer pour modifier le personnage / l'animation

	private x: number = 50;
	private y: number = 50;

    private animationId: number | null = null;
    private animationFps: number = 9;
    private nbFrameMax: number = 7;

constructor(element: Element, spriteSheet: PlaySpriteSheet = PlaySpriteSheet.PLAYER, choixAnim: number, frameCount: number) {
		super(element);

		const config = SpriteSheetConfigs[spriteSheet];
		this.spriteCols = config.columns;
		this.spriteRows = config.rows;
		this.nbFrameMax = frameCount;

		this.resizeListener = () => {
			this.updateCanvasSize();
			this.draw();
		};
		window.addEventListener('resize', this.resizeListener);

		this.img = new Image();
		this.img.src = config.path;
        
		this.img.onload = () => {
			this.spriteWidth = this.img.width / this.spriteCols;
			this.spriteHeight = this.img.height / this.spriteRows;

			this.frameX = 0;
			this.frameY = choixAnim >= 0 && choixAnim < this.spriteRows ? choixAnim : 0;

			this.updateCanvasSize();
			this.draw();
		};

        this.img.onerror = () => {
            this.hasError = true;
            this.errorMessage = 'Erreur: Player.png introuvable';
            console.error('[PlayView] impossible de charger Player.png');
            this.updateCanvasSize();
            this.draw();
        };
	}

	show() {
		super.show();
        this.updateCanvasSize();
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
            this.frameX = (this.frameX + 1) % this.nbFrameMax;
            this.draw();
            this.animationId = window.setTimeout(tick, 1000 / this.animationFps);
        };

        this.frameX = 0;
        this.draw();
        this.animationId = window.setTimeout(tick, 1000 / this.animationFps);
    }

    setRow(row: number) {
        if (row < 0 || row >= this.spriteRows) {
            console.warn('[PlayView] ligne invalide', row);
            return;
        }
        this.frameY = row;
    }

    setSpritePosition(x: number, y: number) {
        if (typeof x !== 'number' || typeof y !== 'number' || Number.isNaN(x) || Number.isNaN(y)) {
            console.warn('[PlayView] coordonnées invalides', x, y);
            return;
        }
        this.x = x;
        this.y = y;
        this.draw();
    }

    setSpriteX(x: number) {
        if (typeof x !== 'number' || Number.isNaN(x)) {
            console.warn('[PlayView] coordonnée X invalide', x);
            return;
        }
        this.x = x;
        this.draw();
    }

    setSpriteY(y: number) {
        if (typeof y !== 'number' || Number.isNaN(y)) {
            console.warn('[PlayView] coordonnée Y invalide', y);
            return;
        }
        this.y = y;
        this.draw();
    }

    private stopAnimation() {
        if (this.animationId !== null) {
            window.clearTimeout(this.animationId);
            this.animationId = null;
        }
    }

    private updateCanvasSize() {
        const dpr = window.devicePixelRatio || 1;
        const displayWidth = canvas.clientWidth;
        const displayHeight = canvas.clientHeight;

        if (displayWidth <= 0 || displayHeight <= 0) {
            return;
        }

        canvas.width = Math.floor(displayWidth * dpr);
        canvas.height = Math.floor(displayHeight * dpr);

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    private draw() {
        const displayWidth = canvas.clientWidth;
        const displayHeight = canvas.clientHeight;

        ctx.clearRect(0, 0, displayWidth, displayHeight);

        if (this.hasError) {
            ctx.fillStyle = '#900';
            ctx.fillRect(0, 0, displayWidth, displayHeight);
            ctx.fillStyle = '#fff';
            ctx.font = '24px sans-serif';
            ctx.fillText(this.errorMessage, 20, 40);
            return;
        }

        if (!this.img.complete || this.img.naturalWidth === 0) {
            ctx.fillStyle = '#333';
            ctx.fillRect(0, 0, displayWidth, displayHeight);
            ctx.fillStyle = '#fff';
            ctx.font = '24px sans-serif';
            ctx.fillText('Chargement...', 20, 40);
            return;
        }

        const frameW = this.spriteWidth || this.img.width;
        const frameH = this.spriteHeight || this.img.height;

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