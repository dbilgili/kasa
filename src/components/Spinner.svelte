<script lang="ts">
	export let size: number = 40;
	export let color: string = '#000000';
	export let thickness: number = 3;
</script>

<div class="spinner-container">
	<div
		class="spinner"
		style="--spinner-size: {size}px; --spinner-color: {color}; --spinner-thickness: {thickness}px;"
	/>
</div>

<style lang="scss">
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.spinner-container {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
	}

	.spinner {
		display: inline-block;
		width: var(--spinner-size);
		height: var(--spinner-size);
		border: var(--spinner-thickness) solid var(--spinner-color);
		border-top-color: transparent;
		border-radius: 50%;
		animation: spin 0.55s linear infinite;
	}
</style>
