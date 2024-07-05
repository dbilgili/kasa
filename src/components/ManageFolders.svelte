<script lang="ts">
	import { updateFile } from '$functions';
	import { getCSSVariable } from '$libs/getCSSVariable';
	import { toastMessage } from '$libs/toast';
	import { darkMode, showManageFolders, decryptedData, fileId, masterKey } from '$store';
	import EditIcon from '$svgs/EditIcon.svelte';
	import Button from './Button.svelte';
	import DeleteIconButton from './DeleteIconButton.svelte';
	import Input from './Input.svelte';
	import Overlay from './Overlay.svelte';
	import StaticIconButton from './StaticIconButton.svelte';

	let deleteLoading: boolean = false;
	let savingFile: boolean = false;
	let selectedField: string = '';

	$: $decryptedData.folders.length < 1 && toggleManageFolders();

	const toggleManageFolders = () => {
		$showManageFolders = !$showManageFolders;
	};

	const saveFolderNames = async (event: Event) => {
		const formData = new FormData(event.target as HTMLFormElement);

		$decryptedData.folders.forEach((folder) => {
			folder.name = formData.get(folder.id) as string;
		});

		$decryptedData = $decryptedData;
		try {
			savingFile = true;
			await updateFile($fileId, $decryptedData, $masterKey);
			toggleManageFolders();
		} catch (error) {
			toastMessage('error', 'Error renaming folder(s)');
		} finally {
			savingFile = false;
		}
	};

	const deleteFolder = async (folderId: string) => {
		$decryptedData.folders = $decryptedData.folders.filter((folder) => folder.id !== folderId);
		const entriesClone = structuredClone($decryptedData.entries);
		entriesClone.forEach((entry) => {
			if (entry.folderId === folderId) {
				entry.folderId = '';
			}
		});

		$decryptedData.entries = entriesClone;
		try {
			deleteLoading = true;
			await updateFile($fileId, $decryptedData, $masterKey);
		} catch (error) {
			toastMessage('error', 'Error deleting the folder');
		} finally {
			deleteLoading = false;
		}
	};
</script>

<Overlay toggleFunction={toggleManageFolders}>
	<div class="container" class:dark-mode={$darkMode}>
		<form on:submit|preventDefault={saveFolderNames}>
			<div class="folder-names">
				{#each structuredClone($decryptedData.folders) as folder}
					<div class="folder-wrapper">
						<div class="item-count" class:dark-mode={$darkMode}>{folder.contentIds.length}</div>
						<Input
							type="text"
							name={folder.id}
							bind:value={folder.name}
							readonly={folder.id !== selectedField ? true : undefined}
						/>
						{#if selectedField === folder.id}
							<DeleteIconButton
								type="button"
								isLoading={deleteLoading}
								on:click={() => deleteFolder(folder.id)}
								padding="10px"
							/>
						{:else}
							<StaticIconButton
								type="button"
								on:click={() => (selectedField = folder.id)}
								bgColor="none"
								borderColor={$darkMode
									? getCSSVariable('--dark-mode-light-gray')
									: getCSSVariable('--border-gray')}
								padding="10px"
							>
								<EditIcon />
							</StaticIconButton>
						{/if}
					</div>
				{/each}
			</div>
			<div class="buttons-wrapper">
				<Button maxWidth={100} type="submit" isLoading={savingFile}>Save</Button>
				<Button variant="black-hollow" maxWidth={100} type="button" on:click={toggleManageFolders}>
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
		max-width: 300px;
		width: 100%;
		background-color: white;
		border-radius: 6px;
		border: 1px solid var(--border-gray);
		padding: var(--spacing-30);
		margin: var(--spacing-20);
		row-gap: var(--spacing-10);

		&.dark-mode {
			background-color: black;
			border-color: var(--dark-mode-light-gray);
		}

		.folder-names {
			max-height: 500px;
			overflow: scroll;
		}

		.item-count {
			padding: 12px 8px;
			border-radius: 5px;
			text-align: center;
			background-color: var(--light-gray);

			&.dark-mode {
				background-color: var(--dark-mode-light-gray);
			}
		}

		.folder-wrapper {
			display: grid;
			grid-template-columns: 2fr auto auto;
			justify-content: space-between;
			width: 100%;
			align-items: center;
			column-gap: var(--spacing-10);
			margin-bottom: var(--spacing-10);
		}

		.buttons-wrapper {
			display: flex;
			column-gap: var(--spacing-10);
			justify-content: center;
			margin-top: var(--spacing-20);
		}
	}
</style>
