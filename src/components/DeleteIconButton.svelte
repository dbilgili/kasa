<script lang="ts">
	import { fade } from 'svelte/transition';
	import Spinner from './Spinner.svelte';
	import DeleteIcon from '$svgs/DeleteIcon.svelte';
	import { darkMode } from '$store';
	import { getCSSVariable } from '$libs/getCSSVariable';

	export let isLoading: boolean;
	export let padding: string = '6px 6px';

	let buttonElement: HTMLButtonElement;

	$: if (isLoading) {
		buttonElement.classList.add('loading');
	} else if (!isLoading && buttonElement) {
		setTimeout(() => buttonElement.classList.remove('loading'), 400);
	}
</script>

<button
	on:click
	bind:this={buttonElement}
	{...$$restProps}
	class:dark-mode={$darkMode}
	style="--padding: {padding};"
>
	{#if isLoading}
		<div transition:fade>
			<Spinner color={$darkMode ? getCSSVariable('--red') : 'white'} size={14} thickness={2} />
		</div>
	{:else}
		<DeleteIcon />
	{/if}
</button>

<style lang="scss">
	button {
		display: flex;
		border: 1px solid var(--red);
		border-radius: 4px;
		background-color: var(--red);
		color: white;
		padding: var(--padding);

		&.dark-mode {
			color: var(--red);
			border-color: var(--red);
			background-color: transparent;
		}
	}
</style>
