<script lang="ts">
	export let size: number = 18;
</script>

<svg
	width="24"
	height="24"
	viewBox="0 0 24 24"
	style="--size: {size}px"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
>
	<path
		d="M21.9317 18.5175C21.9762 18.3523 22 18.1788 22 18V8C22 6.9 21.1 6 20 6H12L10 4H7.41421L11.4142 8H20V16.5858L21.9317 18.5175Z"
		fill="currentColor"
	/>
	<path
		d="M6.58579 6H4V18H18.5858L20.5175 19.9317C20.3523 19.9762 20.1788 20 20 20H4C2.9 20 2 19.1 2 18L2.01 6C2.01 4.9 2.9 4 4 4H4.58579L6.58579 6Z"
		fill="currentColor"
	/>
	<path d="M2 2L21.5 21.5" stroke="currentColor" stroke-width="2" />
</svg>

<style lang="scss">
	svg {
		width: var(--size);
		height: var(--size);
	}
</style>
