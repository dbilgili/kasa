<script lang="ts">
	export let id: string;
	export let name: string;
	export let label: string;
	export let checked: boolean = false;
	export let disabled: boolean = false;
</script>

<div class="wrapper">
	<input {name} {id} type="checkbox" value={checked} {disabled} bind:checked />
	<label for={id}>{label}</label>
</div>

<style lang="scss">
	.wrapper {
		display: flex;
		align-items: center;
		width: fit-content;
	}

	input {
		cursor: pointer;
		margin-right: 10px;

		&:disabled {
			cursor: not-allowed;

			& + label {
				color: var(--gray);
				cursor: not-allowed;
			}
		}
	}

	label {
		cursor: pointer;
	}
</style>
