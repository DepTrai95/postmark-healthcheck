/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
	async scheduled(event, env, ctx) {
		await sendHealthcheckEmails(env);
	},

	async fetch(request, env, ctx) {
		// just for testing/dev
		// await sendHealthcheckEmails(env);
		return new Response('✅ Postmark Healthcheck ausgeführt.');
	},
};

async function sendHealthcheckEmails(env) {
	const projects = [
		{
			name: 'MATJO',
			apiKey: env.POSTMARK_API_KEY_MATJO,
			from: 'info@matjo.de',
			to: 'info@matjo.de',
		},
		{
			name: 'Ramen1974',
			apiKey: env.POSTMARK_API_KEY_RAMEN1974,
			from: 'info@ramen1974.de',
			to: 'info@ramen1974.de',
		},
		{
			name: 'Anamit',
			apiKey: env.POSTMARK_API_KEY_ANAMIT,
			from: 'info@anamit.de',
			to: 'info@anamit.de',
		},
	];

	for (const proj of projects) {
		const res = await fetch('https://api.postmarkapp.com/email', {
			method: 'POST',
			headers: {
				'X-Postmark-Server-Token': proj.apiKey,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				From: proj.from,
				To: proj.to,
				Subject: `Täglicher Healthcheck: ${proj.name}`,
				TextBody: `Mail erfolgreich versendet: ${proj.name}`,
			}),
		});

		if (!res.ok) {
			const errorMsg = await res.text();
			console.error(`❌ Fehler bei ${proj.name}:`, errorMsg);
		} else {
			console.log(`✅ ${proj.name} erfolgreich.`);
		}
	}
}