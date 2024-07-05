<script lang="ts">
	import { selectedEntry } from '$store';
	import { createEventDispatcher } from 'svelte';

	// let selectedVersionNumber: number = $selectedEntry ? $selectedEntry.versions.length : 1;
	export let selectedVersionNumber: number;
	const dispatch = createEventDispatcher<{ versionSelection: number }>();

	const nextVersion = () => {
		if (selectedVersionNumber < $selectedEntry!.versions.length) {
			selectedVersionNumber++;
			dispatch('versionSelection', selectedVersionNumber);
		}
	};

	const previousVersion = () => {
		if (selectedVersionNumber > 1) {
			selectedVersionNumber--;
			dispatch('versionSelection', selectedVersionNumber);
		}
	};
</script>

<div class="wrapper">
	{#if $selectedEntry && $selectedEntry.versions.length > 1}
		<button disabled={selectedVersionNumber === 1} on:click={previousVersion}>{`<`}</button>
	{/if}
	<div class="version">v{selectedVersionNumber}</div>
	{#if $selectedEntry && $selectedEntry.versions.length > 1}
		<button
			disabled={selectedVersionNumber === $selectedEntry.versions.length}
			on:click={nextVersion}>{`>`}</button
		>
	{/if}
</div>

<style lang="scss">
	.wrapper {
		align-items: center;
		display: flex;
	}
	button {
		padding: 10px;

		&:disabled {
			opacity: 0.3;
		}
	}
</style>
