import { build, files, version } from '$service-worker';

const CACHE = `cache-${version}`;
const ASSETS = [...build, ...files];

self.addEventListener('install', (event) => {
	const addFilesToCache = async () => {
		const cache = await caches.open(CACHE);
		await cache.addAll(ASSETS);
	};

	event.waitUntil(addFilesToCache());
});

self.addEventListener('activate', (event) => {
	const deleteOldCache = async () => {
		for (const key of await caches.keys()) {
			if (key !== CACHE) await caches.delete(key);
		}
	};

	event.waitUntil(deleteOldCache());
});

self.addEventListener('fetch', (event) => {
	if (event.request.method !== 'GET') return;

	const respond = async () => {
		const url = new URL(event.request.url);
		const cache = await caches.open(CACHE);

		if (ASSETS.includes(url.pathname)) {
			return cache.match(event.request);
		}

		try {
			const response = await fetch(event.request);
			if (response.status === 200) {
				cache.put(event.request, response.clone());
			}
			return response;
		} catch {
			return cache.match(event.request);
		}
	};

	event.respondWith(respond());
});
