// `erasableSyntaxOnly` n'autorise pas `enum`/`const enum`.
export const DeplacementType = {
	Keyboard: 0,
	Mouse: 1,
} as const;

export type DeplacementType =
	(typeof DeplacementType)[keyof typeof DeplacementType];
