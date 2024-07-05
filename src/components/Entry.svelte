<script lang="ts">
	import { v4 as uuidv4 } from 'uuid';
	import { addEntryToFolder, removeEntryFromFolder, updateFile } from '$functions';
	import {
		decryptedData,
		selectedEntry,
		fileId,
		masterKey,
		showEntrySidebar,
		darkMode,
		showAddFolder
	} from '$store';
	import type { EntryType, VersionType } from '$types';
	import Button from './Button.svelte';
	import Input from './Input.svelte';
	import Textarea from './Textarea.svelte';
	import DeleteIconButton from './DeleteIconButton.svelte';
	import NoFolderIcon from '$svgs/NoFolderIcon.svelte';
	import { onDestroy } from 'svelte';
	import { toastMessage } from '$libs/toast';
	import VersionButton from './VersionButton.svelte';
	import Select from './Select.svelte';
	import StaticIconButton from './StaticIconButton.svelte';
	import PlusIcon from '$svgs/PlusIcon.svelte';
	import { getCSSVariable } from '$libs/getCSSVariable';

	let nameInitialValue: string = $selectedEntry?.versions.at(-1)?.name ?? '';
	let passwordInitialValue: string = $selectedEntry?.versions.at(-1)?.password ?? '';
	let identifierInitialValue: string = $selectedEntry?.versions.at(-1)?.identifier ?? '';
	let urlInitialValue: string = $selectedEntry?.versions.at(-1)?.url ?? '';
	let notesInitialValue: string = $selectedEntry?.versions.at(-1)?.notes ?? '';
	let folderIdInitialValue: string = $selectedEntry?.folderId ?? '';

	let name: string = nameInitialValue;
	let password: string = passwordInitialValue;
	let identifier: string = identifierInitialValue;
	let url: string = urlInitialValue;
	let notes: string = notesInitialValue;
	let folderId: string = folderIdInitialValue;

	let submitLoading: boolean = false;
	let deleteLoading: boolean = false;
	let editMode: boolean = $selectedEntry ? true : false;
	let timeoutId: ReturnType<typeof setTimeout>;
	let selectedVersionNumber: number = $selectedEntry ? $selectedEntry.versions.length : 1;

	$: formChanged =
		name !== nameInitialValue ||
		password !== passwordInitialValue ||
		identifier !== identifierInitialValue ||
		url !== urlInitialValue ||
		notes !== notesInitialValue ||
		folderId !== folderIdInitialValue;

	const onVersionSelection = (event: CustomEvent<number>) => {
		selectedVersionNumber = event.detail;

		name = nameInitialValue = $selectedEntry?.versions[selectedVersionNumber - 1].name ?? '';
		password = passwordInitialValue =
			$selectedEntry?.versions[selectedVersionNumber - 1].password ?? '';
		identifier = identifierInitialValue =
			$selectedEntry?.versions[selectedVersionNumber - 1].identifier ?? '';
		url = urlInitialValue = $selectedEntry?.versions[selectedVersionNumber - 1].url ?? '';
		notes = notesInitialValue = $selectedEntry?.versions[selectedVersionNumber - 1].notes ?? '';
	};

	const addEntryHandler = async (event: Event) => {
		const formData = new FormData(event.target as HTMLFormElement);

		const entry = {
			id: uuidv4(),
			deleted: false,
			folderId: '',
			versions: [
				{
					id: uuidv4(),
					version: 1,
					createdAt: new Date()
				}
			]
		} as EntryType;

		for (let field of formData) {
			const [key, value] = field;

			if (key === 'no-search-password') {
				entry.versions[0].password = value as string;
				continue;
			}
			if (key === 'folderId') {
				entry.folderId = value as string;
				continue;
			}
			(entry as Record<string, any>).versions[0][key] = value;
		}

		try {
			submitLoading = true;

			$decryptedData.entries.push(entry);
			$decryptedData.entries = $decryptedData.entries;
			entry.folderId && addEntryToFolder(entry.folderId, entry.id);
			await updateFile($fileId, $decryptedData, $masterKey);

			$selectedEntry = entry;
		} catch (error) {
			toastMessage('error', 'Error adding a new entry');
			// Rollback the optimistic update in case server update fails
			removeEntryFromFolder(entry.folderId, entry.id);
			$decryptedData.entries = $decryptedData.entries.slice(0, -1);
		} finally {
			submitLoading = false;
			$showEntrySidebar = false;
			$selectedEntry = null;
		}
	};

	const editEntryHandler = async (event: Event) => {
		const formData = new FormData(event.target as HTMLFormElement);

		const cloneEntry = structuredClone($selectedEntry)!;

		const newVersion: VersionType = structuredClone(cloneEntry.versions.at(-1)) as VersionType;

		for (let field of formData) {
			const [key, value] = field;

			if (key === 'no-search-password') {
				newVersion.password = value as string;
				continue;
			}
			if (key === 'folderId') {
				cloneEntry.folderId = value as string;
				continue;
			}
			(newVersion as Record<string, any>)[key] = value;
		}

		if (
			formData.get('name') !== nameInitialValue ||
			formData.get('identifier') !== identifierInitialValue ||
			formData.get('no-search-password') !== passwordInitialValue ||
			formData.get('url') !== urlInitialValue ||
			formData.get('notes') !== notesInitialValue
		) {
			newVersion.id = uuidv4();
			newVersion.version += 1;
			newVersion.createdAt = new Date();

			cloneEntry.versions.push(newVersion);
		}

		try {
			submitLoading = true;
			const index = $decryptedData.entries.findIndex((entry) => entry.id === $selectedEntry?.id);

			if (cloneEntry.folderId === '' && $selectedEntry?.folderId !== '') {
				removeEntryFromFolder($selectedEntry?.folderId!, cloneEntry.id);
			} else if (
				cloneEntry.folderId !== '' &&
				$selectedEntry?.folderId !== '' &&
				cloneEntry.folderId !== $selectedEntry?.folderId
			) {
				removeEntryFromFolder($selectedEntry?.folderId!, cloneEntry.id);
				addEntryToFolder(cloneEntry.folderId, cloneEntry.id);
			} else if ($selectedEntry?.folderId === '' && cloneEntry.folderId !== '') {
				addEntryToFolder(cloneEntry.folderId, cloneEntry.id);
			}

			$decryptedData.entries[index] = cloneEntry;
			$decryptedData = $decryptedData;
			await updateFile($fileId, $decryptedData, $masterKey);
		} catch {
			toastMessage('error', 'Error editing the entry');
		} finally {
			submitLoading = false;
			$showEntrySidebar = false;
			$selectedEntry = null;
		}
	};

	const removeFromFolder = async () => {
		const cloneEntry = structuredClone($selectedEntry)!;
		cloneEntry.folderId = '';
		removeEntryFromFolder($selectedEntry?.folderId!, cloneEntry.id);

		try {
			submitLoading = true;
			const index = $decryptedData.entries.findIndex((entry) => entry.id === $selectedEntry?.id);
			$decryptedData.entries[index] = cloneEntry;
			$decryptedData = $decryptedData;
			await updateFile($fileId, $decryptedData, $masterKey);
		} catch {
			toastMessage('error', 'Error removing the entry from a folder');
		} finally {
			submitLoading = false;
			$showEntrySidebar = false;
			$selectedEntry = null;
		}
	};

	const restoreEntryHandler = async () => {
		$decryptedData.entries.forEach(
			(entry) => entry.id === $selectedEntry!.id && (entry.deleted = false)
		);

		$decryptedData = $decryptedData;

		try {
			submitLoading = true;
			await updateFile($fileId, $decryptedData, $masterKey);
			$selectedEntry = null;
			$showEntrySidebar = false;
		} catch {
			toastMessage('error', 'Error restoring the entry');
		} finally {
			submitLoading = false;
			// toast.custom()
		}
	};

	const deleteEntryHandler = async () => {
		const index = $decryptedData.entries.findIndex((item) => item.id === $selectedEntry!.id);
		$decryptedData.entries[index].deleted = true;

		const folderIdTemp = $selectedEntry?.folderId!;
		const entryIdTemp = $selectedEntry!.id;

		try {
			deleteLoading = true;
			removeEntryFromFolder($selectedEntry?.folderId!, $selectedEntry!.id);
			await updateFile($fileId, $decryptedData, $masterKey);
			$selectedEntry = null;
			$showEntrySidebar = false;
		} catch (error) {
			addEntryToFolder(folderIdTemp, entryIdTemp);
			toastMessage('error', 'Error deleting the entry');
		} finally {
			deleteLoading = false;
			// toast.custom()
		}
	};

	const deleteEntryPermanentlyHandler = async () => {
		const filteredDecryptedDataEntries = $decryptedData.entries.filter(
			(entry) => entry.id !== $selectedEntry?.id
		);
		$decryptedData.entries = filteredDecryptedDataEntries;

		try {
			deleteLoading = true;
			await updateFile($fileId, $decryptedData, $masterKey);
			$selectedEntry = null;
			$showEntrySidebar = false;
		} catch (error) {
			toastMessage('error', 'Error deleting the entry');
		} finally {
			deleteLoading = false;
		}
	};

	const onCancelHandler = () => {
		timeoutId = setTimeout(() => {
			$selectedEntry = null;
		}, 300);
		$showEntrySidebar = false;
	};

	onDestroy(() => clearInterval(timeoutId));
</script>

<div class={`container ${$darkMode && 'dark-mode'}`}>
	<div class="header-wrapper">
		{#if $selectedEntry}
			<VersionButton {selectedVersionNumber} on:versionSelection={onVersionSelection} />
			{selectedVersionNumber === 1 ? 'Created' : 'Updated'} on {new Date(
				$selectedEntry?.versions[selectedVersionNumber - 1].createdAt
			).toLocaleDateString()}
			<DeleteIconButton
				on:click={$selectedEntry.deleted ? deleteEntryPermanentlyHandler : deleteEntryHandler}
				isLoading={deleteLoading}
			/>
		{:else}
			New Entry
		{/if}
	</div>

	<form
		method="POST"
		on:submit|preventDefault={$selectedEntry?.deleted
			? restoreEntryHandler
			: editMode
			? editEntryHandler
			: addEntryHandler}
	>
		<Input
			name="name"
			bind:value={name}
			placeholder="Name"
			required
			disabled={$selectedEntry?.deleted}
		/>
		<Input
			name="identifier"
			bind:value={identifier}
			placeholder="Username / E-mail"
			withCopy
			disabled={$selectedEntry?.deleted}
			style="padding-right: 50px"
		/>
		<Input
			name="no-search-password"
			bind:value={password}
			placeholder="Password"
			isPassword
			withCopy
			withGeneratePassword
			disabled={$selectedEntry?.deleted}
			style="padding-right: 110px"
		/>
		<Input
			name="url"
			bind:value={url}
			placeholder="Url"
			withCopy
			withOpenUrl
			disabled={$selectedEntry?.deleted}
			style="padding-right: 80px"
		/>
		<Textarea
			name="notes"
			bind:value={notes}
			placeholder="Notes"
			disabled={$selectedEntry?.deleted}
		/>
		<div class="folder-option-wrapper">
			<StaticIconButton
				on:click={() => ($showAddFolder = true)}
				padding="6px 10px"
				bgColor={$darkMode ? getCSSVariable('--dark-mode-gray') : 'white'}
				color={$darkMode ? 'white' : 'black'}
				borderColor={$darkMode ? getCSSVariable('--dark-mode-gray') : 'black'}
			>
				<PlusIcon />
			</StaticIconButton>
			<Select
				name="folderId"
				options={$decryptedData.folders.map((folder) => ({
					label: folder.name,
					value: folder.id
				}))}
				bind:value={folderId}
				on:change={(e) => (folderId = e.target?.value)}
				disabled={$selectedEntry?.deleted}
			/>
			{#if $selectedEntry?.folderId}
				<StaticIconButton
					on:click={removeFromFolder}
					padding="6px 10px"
					bgColor={$darkMode ? getCSSVariable('--dark-mode-gray') : 'white'}
					color={$darkMode ? 'white' : 'black'}
					borderColor={$darkMode ? getCSSVariable('--dark-mode-gray') : 'black'}
				>
					<NoFolderIcon />
				</StaticIconButton>
			{/if}
		</div>
		<div class="buttons-wrapper">
			<Button
				type="submit"
				variant={$selectedEntry?.deleted ? 'black' : editMode ? 'orange' : 'green'}
				isLoading={submitLoading}
				disabled={editMode && !$selectedEntry?.deleted ? !formChanged : false}
			>
				{#if $selectedEntry?.deleted}
					Restore
				{:else if editMode}
					Update
				{:else}
					Create
				{/if}
			</Button>
			<Button variant="black-hollow" type="button" on:click={onCancelHandler}>Cancel</Button>
		</div>
	</form>
</div>

<style lang="scss">
	.container {
		width: 320px;
		background-color: white;
		position: relative;

		@media (width <= $bp-small) {
			width: 100vw;
			padding: var(--spacing-30) var(--spacing-20);
		}

		&.extra-padding {
			padding-top: var(--spacing-20);
		}

		&.dark-mode {
			background-color: var(--dark-mode-dark-gray);
		}

		.folder-option-wrapper {
			display: flex;
			column-gap: var(--spacing-10);
		}

		.header-wrapper {
			margin-bottom: var(--spacing-20);
			font-size: 14px;
			color: var(--gray);
			height: 32px;
			display: flex;
			justify-content: space-between;
			align-items: center;
		}

		form {
			display: flex;
			flex-direction: column;
			row-gap: var(--spacing-15);

			.buttons-wrapper {
				display: flex;
				margin-top: var(--spacing-15);
				column-gap: var(--spacing-10);
			}
		}
	}
</style>
