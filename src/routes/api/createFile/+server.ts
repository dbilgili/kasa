import { env } from '$env/dynamic/private';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { setKV } from '$kv/functions';
import { createWriteLocalTextFile } from '$localDev/functions';
import { generateSalt, hashString } from '$libs/crypto';

export const POST = (async ({ request }) => {
	const body = await request.json();

	if (env.STORAGE_TYPE === 'vercel-kv') {
		const salt = generateSalt();
		const hashedPassword = hashString(salt, body.masterKey);

		if (env.KV_KEY_NAME) {
			await setKV(`${env.KV_KEY_NAME}_salt`, salt);
			await setKV(`${env.KV_KEY_NAME}_hash`, hashedPassword);
			await setKV(env.KV_KEY_NAME, body.generatedCipherText);
		} else {
			error(500, 'KV_KEY_NAME is not defined');
		}
	} else if (env.STORAGE_TYPE === 'local') {
		await createWriteLocalTextFile(body.generatedCipherText);
	}

	return json({ id: '' }, { status: 201 });
}) satisfies RequestHandler;
