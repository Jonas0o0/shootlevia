import View from './View.ts';
import type { GameStats } from './types.ts';

export default class PopupGameOverView extends View {
	replayBtn: HTMLButtonElement;
	leaveBtn: HTMLButtonElement;
	onReplay?: () => void;
	onQuit?: () => void;

	constructor(element: Element, onReplay?: () => void, onQuit?: () => void) {
		super(element);
		this.onReplay = onReplay;
		this.onQuit = onQuit;

		this.replayBtn = this.element.querySelector('.popupGameOver .replayBtn') as HTMLButtonElement;
		this.leaveBtn = this.element.querySelector('.popupGameOver .leaveBtn') as HTMLButtonElement;

		this.replayBtn.addEventListener('click', (e) => {
			e.preventDefault();
			this.hide();
			if (this.onReplay) this.onReplay();
		});

		this.leaveBtn.addEventListener('click', (e) => {
			e.preventDefault();
			this.hide();
			if (this.onQuit) this.onQuit();
		});
	}

	setCallbacks(onReplay: () => void, onQuit: () => void) {
		this.onReplay = onReplay;
		this.onQuit = onQuit;
	}

	setStats(stats: GameStats) {
		const container = this.element.querySelector('.infos-container');
		if (container) {
			const totalSeconds = Math.floor(stats.time / 60);
			const minutes = Math.floor(totalSeconds / 60);
			const seconds = totalSeconds % 60;
			const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

			let statsHtml = `
				<div class="stat-item">
					<span class="stat-label">Temps:</span>
					<span class="stat-value">${timeString}</span>
				</div>
				<div class="stat-item">
					<span class="stat-label">Score équipe:</span>
					<span class="stat-value">${stats.score}</span>
				</div>
				<div class="stat-item">
					<span class="stat-label">Ennemis tués:</span>
					<span class="stat-value">${stats.enemyCount}</span>
				</div>
			`;

			if (stats.leaderboard && stats.leaderboard.length > 0) {
				statsHtml += `
					<div class="leaderboard-section">
						<h3>Classement Joueurs</h3>
						<table class="leaderboard-table">
							<thead>
								<tr>
									<th>#</th>
									<th>Joueur</th>
									<th>Score</th>
								</tr>
							</thead>
							<tbody>
								${stats.leaderboard
					.map(
						(entry, index) => `
									<tr>
										<td>${index + 1}</td>
										<td>${entry.username}</td>
										<td>${entry.score}</td>
									</tr>
								`,
					)
					.join('')}
							</tbody>
						</table>
					</div>
				`;
			}

			container.innerHTML = statsHtml;
		}
	}
}
