<script lang="ts">
	import Button from '$components/Button.svelte';
	import Input from '$components/Input.svelte';
	import StaticIconButton from '$components/StaticIconButton.svelte';
	import { createFile, unlock } from '$functions';
	import { toastMessage } from '$libs/toast';
	import { cipherText, masterKey } from '$store';
	import UnlockIcon from '$svgs/UnlockIcon.svelte';
	import { getCSSVariable } from '../libs/getCSSVariable';

	let isLoading = false;

	const handleUnlock = () => {
		try {
			unlock($cipherText, $masterKey);
		} catch (err) {
			if (err instanceof Error) {
				toastMessage('error', err.message);
				document.getElementsByTagName('input')[0].focus();
			}
		}
	};

	const handleCreateFile = async () => {
		isLoading = true;
		try {
			await createFile($masterKey);
			unlock($cipherText, $masterKey);
		} catch (err) {
			if (err instanceof Error) {
				toastMessage('error', err.message);
			}
		} finally {
			isLoading = false;
		}
	};
</script>

<div class="container">
	<div class="wrapper">
		{#if $cipherText}
			<form on:submit|preventDefault={handleUnlock}>
				<Input
					class="taller centered-text"
					bind:value={$masterKey}
					placeholder="Master password"
					isPassword
					autofocus
				/>
				<StaticIconButton
					type="submit"
					borderRadius="50%"
					bgColor={!$masterKey.length ? getCSSVariable('--border-gray') : 'black'}
					borderColor="white"
					color="white"
					padding="10px"
					disabled={!$masterKey.length}
				>
					<UnlockIcon size={25} />
				</StaticIconButton>
			</form>
		{:else}
			<form on:submit|preventDefault={handleCreateFile}>
				<Input
					class="taller centered-text"
					bind:value={$masterKey}
					placeholder="Master password"
					isPassword
					autofocus
				/>
				<Button type="submit" {isLoading} disabled={!$masterKey.length || isLoading} maxWidth={110}
					>Create</Button
				>
			</form>
		{/if}
	</div>
</div>

<style lang="scss">
	.container {
		padding: 0 var(--spacing-30);
		width: calc(100% - 60px);

		.logo {
			margin-bottom: var(--spacing-50);
		}

		form {
			width: 100%;
		}

		.wrapper {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			height: 100svh;
			margin: 0 auto;
			max-width: 500px;
			width: 100%;

			form {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				row-gap: var(--spacing-15);
			}
		}
	}
</style>
