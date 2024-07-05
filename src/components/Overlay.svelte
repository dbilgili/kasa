<script lang="ts">
	import { darkMode } from '$store';
	import { fade } from 'svelte/transition';

	export let toggleFunction: () => void;
</script>

<div class="wrapper" transition:fade={{ duration: 80 }}>
	<button on:click={toggleFunction} class="overlay" class:dark-mode={$darkMode} />
	<slot />
</div>

<style lang="scss">
	.wrapper {
		display: flex;
		width: 100%;
		height: 100svh;
		left: 0;
		top: 0;
		position: absolute;
		justify-content: center;
		align-items: center;
		filter: blur(0.5);

		@media (width <= $bp-medium) {
			align-items: flex-start;
			margin-top: var(--spacing-60);
		}

		.overlay {
			width: 100%;
			height: 100%;
			position: fixed;
			top: 0;
			left: 0;
			cursor: initial;
			display: flex;
			justify-content: center;
			align-items: center;
			background-color: white;
			opacity: 0.85;
			z-index: 2;

			&.dark-mode {
				background-color: black;
			}
		}
	}
</style>
