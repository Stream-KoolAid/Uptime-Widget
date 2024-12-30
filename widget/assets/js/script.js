/*╔══════════════╗*/
/*║  PARAMETERS  ║*/
/*╚══════════════╝*/

// Constants
const RETRY_INTERVAL = 3000;
const API_ENDPOINTS = {
	twitch: (username) => `https://decapi.me/twitch/uptime/${username}`,
	kick: (username) => `https://kick.com/api/v2/channels/${username}/livestream`,
};

// Utility Functions
const parseQueryParams = () => {
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);

	return {
		platform: urlParams.get('platform') || 'twitch',
		username: urlParams.get('username') || '',
		prefix: urlParams.get('prefix') || '',
		format: urlParams.get('format') === 'long' ? 'long' : 'short',
		hideSeconds: urlParams.get('hideSeconds') === 'true',
		fontFamily: urlParams.get('fontFamily'),
	};
};

// Font Manager
class FontManager {
	static async loadCustomFont() {
		const params = parseQueryParams();
		if (!params.fontFamily) return;

		// Set the font-family CSS variable with serif fallback
		const fontFamilyValue = `"${params.fontFamily}", serif`;
		document.documentElement.style.setProperty(
			'--font-family',
			fontFamilyValue
		);

		// Apply the CSS variable to the root element
		document.documentElement.style.fontFamily = 'var(--font-family)';

		const link = document.createElement('link');
		link.href = `https://fonts.googleapis.com/css?family=${encodeURIComponent(
			params.fontFamily
		)}:wght@100;300;400;500;700;900`;
		link.rel = 'stylesheet';
		document.head.appendChild(link);

		// Wait for font to load
		try {
			await document.fonts.load(`16px ${params.fontFamily}`);
		} catch (error) {
			console.warn(`Failed to load font: ${params.fontFamily}`, error);
		}
	}
}

// Uptime Display Manager
class UptimeDisplayManager {
	constructor(params) {
		this.params = params;
		this.streamStartTime = null;
		this.retryInterval = null;
		this.uptimeLabel = document.getElementById('uptimeLabel');
	}

	formatUptime(hours, minutes, seconds) {
		if (this.params.format === 'short') {
			const h = hours.toString().padStart(2, '0');
			const m = minutes.toString().padStart(2, '0');
			const s = seconds.toString().padStart(2, '0');
			return this.params.hideSeconds ? `${h}:${m}` : `${h}:${m}:${s}`;
		} else {
			return this.params.hideSeconds
				? `${hours} hours, ${minutes} minutes`
				: `${hours} hours, ${minutes} minutes, ${seconds} seconds`;
		}
	}

	updateDisplay() {
		if (!this.streamStartTime) return;

		const now = new Date();
		let uptime = now.getTime() - this.streamStartTime.getTime();

		let hours = Math.floor(uptime / 3600000);
		uptime %= 3600000;
		let minutes = Math.floor(uptime / 60000);
		uptime %= 60000;
		let seconds = Math.floor(uptime / 1000);

		const formattedUptime = this.formatUptime(hours, minutes, seconds);
		this.uptimeLabel.innerHTML = `${this.params.prefix} ${formattedUptime}`;
	}

	setOffline() {
		this.uptimeLabel.innerHTML = 'Offline';
		if (!this.retryInterval) {
			this.retryInterval = setInterval(
				() => this.fetchUptime(),
				RETRY_INTERVAL
			);
		}
	}

	async fetchUptime() {
		try {
			if (this.params.platform === 'twitch') {
				await this.fetchTwitchUptime();
			} else if (this.params.platform === 'kick') {
				await this.fetchKickUptime();
			}
		} catch (error) {
			console.error(`Error fetching uptime: ${error}`);
			this.setOffline();
		}
	}

	async fetchTwitchUptime() {
		const response = await fetch(API_ENDPOINTS.twitch(this.params.username));
		const metric = await response.text();

		const matches = metric.match(/(\d+) hours, (\d+) minutes, (\d+) seconds/);
		if (matches) {
			if (this.retryInterval) clearInterval(this.retryInterval);

			const [_, hours, minutes, seconds] = matches;
			const totalSeconds =
				parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds);
			this.streamStartTime = new Date(Date.now() - totalSeconds * 1000);

			this.updateDisplay();
			setInterval(() => this.updateDisplay(), 1000);
		} else {
			this.setOffline();
		}
	}

	async fetchKickUptime() {
		const response = await fetch(API_ENDPOINTS.kick(this.params.username));
		const data = await response.json();

		if (!data.data) {
			this.setOffline();
			return;
		}

		if (this.retryInterval) clearInterval(this.retryInterval);

		this.streamStartTime = new Date(data.data.created_at);
		this.updateDisplay();
		setInterval(() => this.updateDisplay(), 1000);
	}
}

// Initialize Application
document.addEventListener('DOMContentLoaded', async () => {
	// Load custom font
	await FontManager.loadCustomFont();

	// Initialize uptime display
	const params = parseQueryParams();
	const uptimeManager = new UptimeDisplayManager(params);
	uptimeManager.fetchUptime();
});
