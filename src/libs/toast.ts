import toast from 'svelte-french-toast';
import { getCSSVariable } from './getCSSVariable';
import { darkMode } from '$store';

export const toastMessage = (type: 'error' | 'success', msg: string) => {
	const unsubscribe = darkMode.subscribe((dm) => {
		toast[type](msg, {
			duration: 1500,
			style: dm ? 'border-radius: 200px; background: #333; color: #fff;' : 'border-radius: 200px;',
			iconTheme: {
				primary: getCSSVariable(type === 'error' ? '--red' : '--green'),
				secondary: 'white'
			}
		});
	});

	unsubscribe();
};
