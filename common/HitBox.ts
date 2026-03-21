export interface HitBox {
	x: number;
	y: number;
	width: number;
	height: number;
}

export function checkCollision(a: HitBox, b: HitBox): boolean {
	return (
		a.x < b.x + b.width &&
		a.x + a.width > b.x &&
		a.y < b.y + b.height &&
		a.y + a.height > b.y
	);
}

export function getOverlap(a: HitBox, b: HitBox): { x: number; y: number } {
	return {
		x: Math.min(a.x + a.width - b.x, b.x + b.width - a.x),
		y: Math.min(a.y + a.height - b.y, b.y + b.height - a.y),
	};
}

export function getCenter(h: HitBox): { x: number; y: number } {
	return {
		x: h.x + h.width / 2,
		y: h.y + h.height / 2,
	};
}
