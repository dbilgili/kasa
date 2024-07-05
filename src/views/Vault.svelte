<script lang="ts">
	import EntriesTable from '$components/EntriesTable.svelte';
	import {
		selectedEntry,
		decryptedData,
		showEntrySidebar,
		screenSize,
		showBin,
		showChangePassword,
		darkMode,
		showAddFolder,
		selectedFolderId,
		showManageFolders
	} from '$store';
	import Button from '$components/Button.svelte';
	import { fly } from 'svelte/transition';
	import Input from '$components/Input.svelte';
	import type { EntryType, FolderType } from '$types';
	import StaticIconButton from '$components/StaticIconButton.svelte';
	import PlusIcon from '$svgs/PlusIcon.svelte';
	import Menu from '$components/Menu.svelte';
	import ChangePassword from '$components/ChangePassword.svelte';
	import AddFolder from '$components/AddFolder.svelte';
	import { sineInOut } from 'svelte/easing';
	import EditFolder from '$components/EditFolder.svelte';
	import ManageFolders from '$components/ManageFolders.svelte';
	import Entry from '$components/Entry.svelte';

	let filteredEntries: EntryType[] = [];
	let filteredFolders: FolderType[] = [];
	let filterText: string = '';

	const onAddHandler = () => {
		$showEntrySidebar = true;
		$selectedEntry = null;
	};

	const filter = (input: string) => {
		filteredEntries = [];
		filteredFolders = [];
		filteredEntries = $decryptedData.entries.filter((entry) => {
			const latestVersion = entry.versions.at(-1);

			return (
				latestVersion?.name.toLowerCase().includes(input.toLowerCase()) ||
				latestVersion?.identifier?.toLowerCase().includes(input.toLowerCase()) ||
				latestVersion?.notes?.toLocaleLowerCase().includes(input.toLowerCase())
			);
		});

		filteredEntries
			.map((entry) => entry.folderId)
			.forEach((folderId) => {
				const folder = $decryptedData.folders.find((folder) => folder.id === folderId);

				if (folder && !filteredFolders.find((item) => item.id === folder.id)) {
					const filteredContentIds = folder.contentIds.filter((id) =>
						filteredEntries.find((entry) => entry.id === id)
					);
					filteredFolders.push({ ...folder, contentIds: filteredContentIds });
				}
			});
	};

	$: filter(filterText), $decryptedData;
</script>

<div class={`container ${$darkMode && 'dark-mode'}`}>
	<div class="header">
		{#if $showBin}
			<StaticIconButton
				on:click={() => ($showBin = false)}
				padding="10px 15px"
				bgColor={'orange'}
				color={$darkMode ? 'white' : 'white'}
				borderColor={'orange'}
			>
				{`<`}
			</StaticIconButton>
		{:else if $screenSize.medium || $screenSize.small}
			<StaticIconButton
				on:click={onAddHandler}
				padding="6px 10px"
				bgColor={$darkMode ? 'white' : 'black'}
				color={$darkMode ? 'black' : 'white'}
				borderColor={$darkMode ? 'white' : 'black'}
			>
				<PlusIcon />
			</StaticIconButton>
		{:else}
			<Button on:click={onAddHandler} minWidth={180} variant="black">Add credential</Button>
		{/if}
		<Input bind:value={filterText} placeholder="Search" type="search" />
		<Menu />
	</div>

	<EntriesTable
		entries={filteredEntries.filter((item) => item.deleted === $showBin)}
		folders={filteredFolders}
	/>

	{#if $showEntrySidebar}
		<div
			class="entry-sidebar"
			class:dark-mode={$darkMode}
			class:no-border={$screenSize.small}
			style="--width: {$screenSize.small ? $screenSize.value : 320}px;"
			transition:fly={{ duration: 250, easing: sineInOut, x: '100%' }}
		>
			{#key $selectedEntry?.id}
				<Entry />
			{/key}
		</div>
	{/if}
</div>

{#if $showChangePassword}
	<ChangePassword />
{/if}

{#if $showAddFolder}
	<AddFolder />
{/if}

{#if $selectedFolderId}
	<EditFolder />
{/if}

{#if $showManageFolders}
	<ManageFolders />
{/if}

<style lang="scss">
	.container {
		position: relative;
		overflow: hidden;
		padding: 0 var(--spacing-50);
		max-width: 1000px;
		margin: var(--spacing-30) auto;
		border: 1px solid var(--light-gray);
		border-radius: 20px;
		height: calc(100svh - 2 * var(--spacing-30));

		&.dark-mode {
			border-color: var(--dark-mode-light-gray);
		}

		@media (width <= $bp-large) {
			padding: 0 var(--spacing-20);
			margin: 0 auto;
			border-radius: 0;
			border: none;
			height: calc(100svh - var(--spacing-20));
		}

		@media (pointer: none), (pointer: coarse) {
			height: 100svh;
		}

		.header {
			display: grid;
			grid-template-columns: auto 4fr auto;
			column-gap: var(--spacing-10);
			margin: var(--spacing-30) 0;
			flex: 1;
		}

		.entry-sidebar {
			position: absolute;
			top: 0;
			right: 0;
			height: 100%;
			width: var(--width);
			transform: translate(0, 0);
			padding: var(--spacing-30);
			border-left: 1px solid var(--light-gray);
			box-shadow: -10px 0px 5px 0px rgba(0, 0, 0, 0.05);
			background-color: white;
			overflow-y: auto;
			z-index: 2;
			display: flex;
			flex-direction: column-reverse;
			justify-content: flex-end;

			// This is a hacky solution for multiple <Entry/> components mounting at the same time
			:global(.container) {
				&:not(:last-child) {
					display: none;
				}
			}

			&.no-border {
				border: none;
			}

			&.dark-mode {
				background-color: var(--dark-mode-dark-gray);
				border-left-color: var(--dark-mode-light-gray);
			}

			@media (width <= $bp-large) {
				position: fixed;
			}

			@media (width <= $bp-small) {
				width: 100vw;
				flex-direction: initial;
				justify-content: center;
				padding: 0;
			}
		}
	}
</style>
