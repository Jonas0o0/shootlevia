export default class AssetLoaderService {
	private static images: Map<string, HTMLImageElement> = new Map();

	/**
	 * Précharge une liste d'URLs d'images.
	 * @param urls Liste des chemins vers les images (ex: ['/assets/Player.png', ...])
	 * @returns Promise résolue une fois que toutes les images sont chargées.
	 */
	static async loadAll(urls: string[]): Promise<void> {
		const loadPromises = urls.map(url => this.loadImage(url));
		await Promise.all(loadPromises);
	}

	/**
	 * Charge une seule image et la stocke.
	 */
	private static loadImage(url: string): Promise<void> {
		return new Promise((resolve, reject) => {
			if (this.images.has(url)) {
				resolve();
				return;
			}

			const img = new Image();
			img.onload = () => {
				this.images.set(url, img);
				resolve();
			};
			img.onerror = err => {
				console.error(`Impossible de charger l'image : ${url}`, err);
				reject(err);
			};
			img.src = url;
		});
	}

	/**
	 * Récupère une image déjà chargée.
	 * @throws Error si l'image n'est pas trouvée (non préchargée).
	 */
	static get(url: string): HTMLImageElement {
		const img = this.images.get(url);
		if (!img) {
			throw new Error(
				`L'asset "${url}" n'est pas chargé. Vérifiez l'appel à AssetLoader.loadAll() au démarrage.`
			);
		}
		return img;
	}
}
