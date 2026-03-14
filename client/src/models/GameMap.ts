class GameMap {
	draw(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
		const bgTop = canvas.height * 0.2;
		const groundHeight = canvas.height - bgTop;

		// Fond du ciel
		ctx.fillStyle = '#CECAB7';
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		// Zone de sol (80% de la hauteur)
		ctx.fillStyle = '#5A5C74';
		ctx.fillRect(0, bgTop, canvas.width, groundHeight);

		// Barrière primaire (top: 0, height: 10px)
		ctx.fillStyle = '#B2ADA4';
		ctx.fillRect(0, bgTop, canvas.width, 10);

		// Barrière tertiaire (top: 14px, height: 18px)
		ctx.fillStyle = '#897D8B';
		ctx.fillRect(0, bgTop + 14, canvas.width, 18);

		// Barrière secondaire (top: 38px, height: 9px)
		ctx.fillStyle = '#C1C5C9';
		ctx.fillRect(0, bgTop + 38, canvas.width, 9);

		// Pointillés blancs au centre du sol (effet de mouvement)
		const centerY = bgTop + groundHeight / 2;
		const dashWidth = 50;
		const gapWidth = 50;
		const totalWidth = dashWidth + gapWidth;
		const speed = 0.4; // Vitesse de défilement
		const offset = (performance.now() * speed) % totalWidth;

		ctx.fillStyle = 'white';
		for (let x = canvas.width; x > -totalWidth; x -= totalWidth) {
			ctx.fillRect(x - offset, centerY - 5, dashWidth, 10);
		}
	}
}

export default GameMap;
