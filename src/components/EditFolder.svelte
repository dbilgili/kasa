<script lang="ts">
	import { darkMode, decryptedData, fileId, masterKey, selectedFolderId } from '$store';
	import Button from './Button.svelte';
	import Input from './Input.svelte';
	import Overlay from './Overlay.svelte';
	import { updateFile } from '$functions';
	import { toastMessage } from '$libs/toast';

	let folderName: string =
		$decryptedData.folders.find((folder) => folder.id === $selectedFolderId)?.name || '';

	const updateFolderName = async () => {
		const folder = $decryptedData.folders.find((folder) => folder.id === $selectedFolderId);

		if (folder) {
			const currentFolderName = folder.name;
			try {
				folder.name = folderName;
				await updateFile($fileId, $decryptedData, $masterKey);
				$decryptedData.folders = $decryptedData.folders;
			} catch {
				folder.name = currentFolderName;
				$decryptedData.folders = $decryptedData.folders;
				toastMessage('error', 'Failed to update the folder name');
			} finally {
				closeEditFolder();
			}
		}
	};

	const closeEditFolder = () => {
		$selectedFolderId = '';
	};
</script>

<Overlay toggleFunction={closeEditFolder}>
	<div class="container" class:dark-mode={$darkMode}>
		<form on:submit|preventDefault={updateFolderName}>
			<Input
				name="folderName"
				bind:value={folderName}
				autofocus
				placeholder="Folder name"
				style="text-align: center"
			/>
			<div class="buttons-wrapper">
				<Button maxWidth={100} type="submit">Update</Button>
				<Button variant="black-hollow" maxWidth={100} type="button" on:click={closeEditFolder}
					>Cancel</Button
				>
			</div>
		</form>
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

			.buttons-wrapper {
				display: flex;
				column-gap: var(--spacing-10);
			}
		}
	}
</style>
