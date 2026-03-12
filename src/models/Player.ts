import type { Account } from '../../common/types.ts';

class Player {
	joueur: Account;
	constructor(joueur: Account) {
		this.joueur = joueur;
	}
}

export default Player;
