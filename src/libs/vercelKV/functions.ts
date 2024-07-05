import { createClient } from '@vercel/kv';
import { env } from '$env/dynamic/private';
import { hashString } from '$libs/crypto';

const createKVClient = () => {
	if (env.KV_REST_API_URL && env.KV_REST_API_TOKEN) {
		return createClient({
			url: env.KV_REST_API_URL,
			token: env.KV_REST_API_TOKEN
		});
	}

	throw new Error('KV_REST_API_URL and KV_REST_API_TOKEN are not defined');
};

export const setKV = async (key: string, value: string) => {
	const kv = createKVClient();

	const res = await getKV(key);

	if (res) {
		await kv.del(key);
	}

	await kv.set(key, value);
};

export const getKV = async (key: string) => {
	const kv = createKVClient();

	return await kv.get(key);
};

export const authenticate = async (masterKey: string) => {
	const hash = (await getKV(`${env.KV_KEY_NAME}_hash`)) as string;
	const salt = (await getKV(`${env.KV_KEY_NAME}_salt`)) as string;

	const hashedPassword = hashString(salt, masterKey);

	if (hash !== hashedPassword) {
		throw new Error('Unauthorized action');
	}
};
