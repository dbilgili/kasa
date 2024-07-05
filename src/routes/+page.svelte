<script lang="ts">
	import { lock } from '$functions';
	import { cipherText, locked, fileId } from '$store';
	import Home from '$views/Home.svelte';
	import Vault from '$views/Vault.svelte';
	import { disablePageScroll } from 'scroll-lock';
	import { onDestroy, onMount } from 'svelte';
	import { Toaster } from 'svelte-french-toast';

	export let data;
	let timeoutId: ReturnType<typeof setTimeout>;
	let countDown = 15;

	$cipherText = data.cipherText;
	$fileId = data.fileId;

	onMount(() => {
		disablePageScroll();
		document.addEventListener('visibilitychange', () => {
			if (document.visibilityState !== 'visible') {
				timeoutId = setInterval(() => {
					if (countDown > 0) {
						countDown--;
					} else {
						clearInterval(timeoutId);
					}
				}, 1000);
			} else {
				countDown = 15;
				clearInterval(timeoutId);
			}
		});
	});

	onDestroy(() => {
		clearInterval(timeoutId);
	});

	$: if (countDown <= 0) lock();
</script>

<Toaster />
{#if $locked || $locked === null}
	<Home />
{:else}
	<Vault />
{/if}
