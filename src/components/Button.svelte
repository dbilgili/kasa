<script lang="ts">
	import { fade } from 'svelte/transition';
	import Spinner from './Spinner.svelte';
	import { darkMode } from '$store';
	import { onDestroy } from 'svelte';
	import { getCSSVariable } from '$libs/getCSSVariable';

	export let isLoading: boolean = false;
	export let variant: 'black' | 'black-hollow' | 'red' | 'green' | 'orange' = 'black';
	export let minWidth: number | string = 'unset';
	export let maxWidth: number | string = 'unset';

	let buttonElement: HTMLButtonElement;
	let timeoutId: ReturnType<typeof setTimeout>;

	const getSpinnerColor = () => {
		switch (variant) {
			case 'black':
				return $darkMode ? 'black' : 'white';
			case 'black-hollow':
				return $darkMode ? 'white' : getCSSVariable('--gray');
			case 'red':
				return $darkMode ? getCSSVariable('--red') : 'white';
			case 'green':
				return $darkMode ? getCSSVariable('--green') : 'white';
			case 'orange':
				return $darkMode ? getCSSVariable('--orange') : 'white';
			default:
				return 'white';
		}
	};

	$: if (isLoading) {
		buttonElement.classList.add('loading');
	} else if (!isLoading && buttonElement) {
		timeoutId = setTimeout(() => buttonElement.classList.remove('loading'), 400);
	}

	onDestroy(() => clearInterval(timeoutId));
</script>

<button
	bind:this={buttonElement}
	on:click
	style="--min-width: {minWidth}px; --max-width: {maxWidth}px;"
	{...$$restProps}
	class={`${$$props.class} ${variant}`}
	class:dark-mode={$darkMode}
>
	{#if isLoading}
		<div transition:fade>
			<Spinner color={getSpinnerColor()} size={12} thickness={2} />
		</div>
	{/if}
	<div class="title">
		<slot />
	</div>
</button>

<style lang="scss">
	button {
		cursor: pointer;
		display: grid;
		grid-template-columns: 20px 1fr 20px;
		column-gap: 0;
		padding: 0;
		font-size: var(--font-size-14);
		position: relative;
		align-items: center;
		justify-content: center;
		border-radius: 6px;
		height: 40px;
		color: white;
		transition: all 200ms;
		min-width: var(--min-width);
		max-width: var(--max-width);
		width: inherit;
		border: 1px solid;

		.title {
			grid-column-start: 2;
		}

		&:disabled {
			cursor: not-allowed;
			opacity: 0.35;
		}

		&.loading {
			grid-template-columns: 25px 1fr 20px;
			column-gap: var(--spacing-5);
			padding-left: var(--spacing-15);
		}

		&.black {
			background-color: black;
			border-color: black;

			&.dark-mode {
				background-color: white;
				border-color: white;
				color: black;
			}
		}

		&.black-hollow {
			background-color: transparent;
			border: 1px solid var(--gray);
			color: var(--gray);

			&.dark-mode {
				border-color: white;
				color: white;
			}
		}

		&.green {
			background-color: var(--green);

			&.dark-mode {
				background-color: transparent;
				border-color: var(--green);
				color: var(--green);
			}
		}

		&.red {
			background-color: var(--red);

			&.dark-mode {
				background-color: transparent;
				border-color: var(--red);
				color: var(--red);
			}
		}

		&.orange {
			background-color: var(--orange);

			&.dark-mode {
				background-color: transparent;
				border-color: var(--orange);
				color: var(--orange);
			}
		}
	}
</style>
