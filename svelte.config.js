import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter(),
		alias: {
			$kv: 'src/libs/vercelKV/*',
			$localDev: 'src/libs/localDev/*',
			$libs: 'src/libs/*',
			$crypto: 'src/libs/crypto.ts',
			$views: 'src/views/*',
			$components: 'src/components/*',
			$types: 'src/types/*',
			$store: 'src/store.ts',
			$functions: 'src/functions.ts',
			$svgs: 'src/svgs/*'
		}
	}
};

export default config;
