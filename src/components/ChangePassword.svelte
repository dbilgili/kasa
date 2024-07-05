<script lang="ts">
	import {
		fileId,
		cipherText,
		decryptedData,
		showChangePassword,
		masterKey,
		darkMode
	} from '$store';
	import Button from './Button.svelte';
	import Overlay from './Overlay.svelte';
	import Input from './Input.svelte';
	import { decrypt } from '$libs/crypto';
	import { updatePassword } from '$functions';
	import { toastMessage } from '$libs/toast';

	let oldMasterPassword = '';
	let newPassword = '';
	let newPasswordRepeated = '';
	let step = 1;

	const toggleShowPassword = () => {
		$showChangePassword = !$showChangePassword;
	};

	const comfirmPassword = () => {
		try {
			decrypt($cipherText, oldMasterPassword);
			step = 2;
		} catch {
			toastMessage('error', 'Wrong master password');
		}
	};

	const changePassword = async () => {
		if (newPassword !== newPasswordRepeated) {
			toastMessage('error', 'Passwords do not match');
		} else {
			try {
				await updatePassword($fileId, $decryptedData, $masterKey, newPassword);
				$masterKey = newPassword;
				toastMessage('success', 'Password updated');
				toggleShowPassword();
			} catch {
				toastMessage('error', 'Failed to update the password');
			}
		}
	};
</script>

<Overlay toggleFunction={toggleShowPassword}>
	<div class="container" class:dark-mode={$darkMode}>
		{#if step === 1}
			<!-- name property contains the keyword of 'search' to prevent iOS suggesting passwords -->
			<form on:submit|preventDefault={comfirmPassword}>
				<Input
					name="no-search-old-password"
					placeholder="Old password"
					bind:value={oldMasterPassword}
					style="text-align: center"
					autofocus
					isPassword
				/>
				<div class="buttons-wrapper">
					<Button maxWidth={100}>Comfirm</Button>
					<Button type="button" variant="black-hollow" maxWidth={100} on:click={toggleShowPassword}
						>Cancel</Button
					>
				</div>
			</form>
		{:else if step === 2}
			<form on:submit|preventDefault={changePassword}>
				<div class="inputs-wrapper">
					<Input
						name="no-search-new-password"
						placeholder="New password"
						bind:value={newPassword}
						style="text-align: center"
						autofocus
						isPassword
					/>
					<Input
						name="no-search-new-password-comfirm"
						placeholder="Repeat new password"
						bind:value={newPasswordRepeated}
						style="text-align: center"
						isPassword
					/>
				</div>
				<div class="buttons-wrapper">
					<Button maxWidth={200}>Update</Button>
					<Button type="button" variant="black-hollow" maxWidth={100} on:click={toggleShowPassword}
						>Cancel</Button
					>
				</div>
			</form>
		{/if}
	</div>
</Overlay>

<style lang="scss">
	.container {
		z-index: 3;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 150px;
		max-width: 300px;
		width: 100%;
		background-color: white;
		border-radius: 6px;
		border: 1px solid var(--border-gray);
		padding: var(--spacing-30);
		margin: var(--spacing-20);

		&.dark-mode {
			background-color: black;
			border-color: var(--dark-mode-light-gray);
		}

		form {
			display: flex;
			flex-direction: column;
			row-gap: var(--spacing-20);
			align-items: center;
			width: inherit;

			.inputs-wrapper {
				display: flex;
				flex-direction: column;
				row-gap: var(--spacing-10);
				width: inherit;
			}

			.buttons-wrapper {
				display: flex;
				column-gap: var(--spacing-10);
			}
		}
	}
</style>
