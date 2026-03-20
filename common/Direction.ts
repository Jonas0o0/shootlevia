// `erasableSyntaxOnly` n'autorise pas `enum`/`const enum`.
export const Direction = {
	Up: 0,
	Down: 1,
	Left: 2,
	Right: 3,
	UR20: 4,
	DR20: 5,
	UR35: 6,
	DR35: 7,
} as const;

export type Direction = (typeof Direction)[keyof typeof Direction];
