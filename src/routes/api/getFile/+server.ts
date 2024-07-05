import { env } from '$env/dynamic/private';
import { getKV } from '$kv/functions';
import { readLocalTextFile } from '$localDev/functions';
import { error } from '@sveltejs/kit';

export const GET = async () => {
	if (env.STORAGE_TYPE === 'vercel-kv') {
		if (env.KV_KEY_NAME) {
			const cipherText = (await getKV(env.KV_KEY_NAME)) as string;
			return cipherText ? { fileId: '', cipherText } : { fileId: '', cipherText: '' };
		} else {
			error(500, 'Missing KV_KEY_NAME');
		}
	} else if (env.STORAGE_TYPE === 'local') {
		return await readLocalTextFile();
	}
};
