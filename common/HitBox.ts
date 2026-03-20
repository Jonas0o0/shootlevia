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
