import { env } from '$env/dynamic/private';
import { getKV } from '$kv/functions.js';
import type { PageServerLoad } from './$types';
import { readLocalTextFile } from '$localDev/functions';

export const load: PageServerLoad = async () => {
	if (env.STORAGE_TYPE === 'vercel-kv') {
		const cipherText = (await getKV(env.KV_KEY_NAME)) as string;

		return cipherText ? { fileId: '', cipherText } : { fileId: '', cipherText: '' };
	} else if (env.STORAGE_TYPE === 'local') {
		return await readLocalTextFile();
	} else {
		return { fileId: '', cipherText: '' };
	}
};
