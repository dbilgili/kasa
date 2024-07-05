<script lang="ts">
	import { darkMode } from '$store';

	export let value: string;
	export let options: { label: string; value: string }[];
</script>

<div class="wrapper" class:dark-mode={$darkMode}>
	<select on:change class:dark-mode={$darkMode} disabled={!options.length} {...$$restProps}>
		<option value="" selected disabled>Choose a folder</option>
		{#each options as option}
			<option value={option.value} selected={value === option.value}>{option.label}</option>
		{/each}
	</select>
</div>

<style lang="scss">
	.wrapper {
		position: relative;
		width: 100%;

		&::after {
			position: absolute;
			top: 35%;
			right: var(--spacing-20);
			content: '';
			width: 0;
			height: 0;

			border: solid var(--dark-mode-gray);
			border-width: 0 2px 2px 0;
			display: inline-block;
			padding: 3px;
			transform: rotate(45deg);
		}

		&.dark-mode::after {
			border-color: white;
		}
	}
	select {
		font-size: var(--font-size-14);
		width: 100%;
		height: 42px;
		padding: var(--spacing-10);
		padding-right: var(--spacing-20);
		border-radius: 6px;
		border: 1px solid var(--hover-gray);
		background-color: var(--hover-gray);
		cursor: pointer;
		appearance: none;

		&.dark-mode {
			background-color: var(--dark-mode-gray);
			border-color: var(--dark-mode-light-gray);
			color: white;
		}

		&:focus-visible {
			outline: none;
			border-color: var(--border-gray);
		}

		&:disabled {
			opacity: 0.3;
		}
	}
</style>
