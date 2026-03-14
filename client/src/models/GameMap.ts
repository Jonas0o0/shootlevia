class GameMap {
	draw(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
		const bgTop = canvas.height * 0.2;

		// Fond du ciel
		ctx.fillStyle = '#CECAB7';
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		// Zone de sol (80% de la hauteur)
		ctx.fillStyle = '#5A5C74';
		ctx.fillRect(0, bgTop, canvas.width, canvas.height - bgTop);

		// Barrière primaire (top: 0, height: 10px)
		ctx.fillStyle = '#B2ADA4';
		ctx.fillRect(0, bgTop, canvas.width, 10);

		// Barrière tertiaire (top: 14px, height: 18px)
		ctx.fillStyle = '#897D8B';
		ctx.fillRect(0, bgTop + 14, canvas.width, 18);

		// Barrière secondaire (top: 38px, height: 9px)
		ctx.fillStyle = '#C1C5C9';
		ctx.fillRect(0, bgTop + 38, canvas.width, 9);
	}
}

export default GameMap;
