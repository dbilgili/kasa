<script lang="ts">
	import { getCSSVariable } from '../libs/getCSSVariable';

	export let color: string = '';
	export let borderColor: string = getCSSVariable('--border-gray');
	export let bgColor: string = 'white';
	export let disabledColor: string = 'white';
	export let borderRadius: string = '6px';
	export let padding: string = '6px 6px';
	export let margin: string = '0';
</script>

<button
	type="button"
	on:click|stopPropagation
	style="--color: {color}; --border-color: {borderColor}; --padding: {padding}; --margin: {margin}; --bg-color: {bgColor}; --border-radius: {borderRadius}; --disabled-color: {disabledColor};"
	{...$$restProps}
>
	<slot />
</button>

<style lang="scss">
	button {
		display: flex;
		justify-content: center;
		align-items: center;
		border: 1px solid var(--border-color);
		border-radius: var(--border-radius);
		color: var(--color);
		padding: var(--padding);
		margin: var(--margin);
		background-color: var(--bg-color);

		&:disabled {
			opacity: 0.5;
			color: var(--disabled-color);
		}
	}
</style>
