<script lang="ts">
	import { v4 as uuidv4 } from 'uuid';
	import { darkMode, decryptedData, showAddFolder, fileId, masterKey } from '$store';
	import Button from './Button.svelte';
	import Input from './Input.svelte';
	import Overlay from './Overlay.svelte';
	import { updateFile } from '$functions';
	import { toastMessage } from '$libs/toast';

	let folderName: string = '';
	let savingFile: boolean = false;

	const createFolder = async (event: Event) => {
		const formData = new FormData(event.target as HTMLFormElement);

		$decryptedData.folders.push({
			id: uuidv4(),
			name: formData.get('folderName') as string,
			contentIds: []
		});

		$decryptedData.folders = $decryptedData.folders;
		try {
			savingFile = true;
			await updateFile($fileId, $decryptedData, $masterKey);
			toggleAddFolder();
		} catch (error) {
			toastMessage('error', 'Error creating the folder');
		} finally {
			savingFile = false;
		}
	};

	const toggleAddFolder = () => {
		$showAddFolder = !$showAddFolder;
	};
</script>

<Overlay toggleFunction={toggleAddFolder}>
	<div class="container" class:dark-mode={$darkMode}>
		<form on:submit|preventDefault={createFolder}>
			<Input
				name="folderName"
				bind:value={folderName}
				autofocus
				placeholder="Folder name"
				style="text-align: center"
			/>
			<div class="buttons-wrapper">
				<Button maxWidth={100} type="submit" isLoading={savingFile}>Create</Button>
				<Button variant="black-hollow" maxWidth={100} type="button" on:click={toggleAddFolder}>
					Cancel
				</Button>
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
