import { env } from '$env/dynamic/private';
import { authenticate, setKV } from '$kv/functions';
import { error, type RequestHandler } from '@sveltejs/kit';
import { createWriteLocalTextFile } from '$localDev/functions';

export const PUT = (async ({ request }) => {
	const body = await request.json();

	if (env.STORAGE_TYPE === 'vercel-kv') {
		await authenticate(body.masterKey);
		if (env.KV_KEY_NAME) {
			await setKV(env.KV_KEY_NAME, body.cipherText);
		} else {
			error(500, 'Missing KV_KEY_NAME');
		}
	} else if (env.STORAGE_TYPE === 'local') {
		await createWriteLocalTextFile(body.cipherText);
	}
	return new Response('Success');
}) satisfies RequestHandler;
