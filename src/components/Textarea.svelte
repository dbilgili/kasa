<script lang="ts">
	import { darkMode } from '$store';

	export let value: string = '';
	export let disabled: boolean = false;
</script>

<textarea
	bind:value
	on:input
	{disabled}
	{...$$restProps}
	class={`${$$props.class} ${$darkMode && 'dark-mode'}`}
/>

<style lang="scss">
	textarea {
		color: black;
		border: none;
		border: 1px solid var(--hover-gray);
		background-color: var(--hover-gray);
		border-radius: 5px;
		width: 100%;
		padding-bottom: var(--spacing-10);
		max-width: 100%;
		padding: var(--spacing-10);
		min-height: 150px;
		resize: none;
		font-size: var(--font-size-14);
		box-sizing: border-box;
		line-height: 20px;

		&:focus {
			outline: none;
		}

		&::placeholder {
			color: var(--placeholder-gray);
		}

		&:disabled {
			cursor: not-allowed;
			color: var(--gray);
		}

		&.dark-mode {
			background-color: var(--dark-mode-gray);
			border-color: var(--dark-mode-gray);
			color: white;
		}
	}
</style>
