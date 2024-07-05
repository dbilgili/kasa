<script lang="ts">
	import WindowWidth from '$components/WindowWidth.svelte';
	import { onMount } from 'svelte';
	import '@fontsource/fragment-mono';
	import { isDarkMode } from '$functions';
	import { browser } from '$app/environment';

	if (browser) isDarkMode();

	onMount(() => {
		// To disable the pinch zoom on mobile devices
		document.addEventListener(
			'touchmove',
			function (event) {
				const touchEvent = event as TouchEvent & { scale: number };
				if (touchEvent.scale !== 1) {
					event.preventDefault();
				}
			},
			{ passive: false }
		);
	});
</script>

<svelte:head>
	<meta
		name="viewport"
		content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
	/>
</svelte:head>

<WindowWidth />
<slot />
