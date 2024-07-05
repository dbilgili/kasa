import { env } from '$env/dynamic/private';
import { authenticate, setKV } from '$kv/functions';
import { error, type RequestHandler } from '@sveltejs/kit';
import { createWriteLocalTextFile } from '$localDev/functions';
import { generateSalt, hashString } from '$libs/crypto';

export const PUT = (async ({ request }) => {
	const body = await request.json();

	if (env.STORAGE_TYPE === 'vercel-kv') {
		await authenticate(body.masterKey);

		const salt = generateSalt();
		const hashedPassword = hashString(salt, body.newMasterKey);

		// Update salt, hash and cipherText
		if (env.KV_KEY_NAME) {
			await setKV(`${env.KV_KEY_NAME}_salt`, salt);
			await setKV(`${env.KV_KEY_NAME}_hash`, hashedPassword);
			await setKV(env.KV_KEY_NAME, body.generatedCipherText);
		} else {
			error(500, 'Missing KV_KEY_NAME');
		}
	} else if (env.STORAGE_TYPE === 'local') {
		await createWriteLocalTextFile(body.cipherText);
	}
	return new Response('Success');
}) satisfies RequestHandler;
