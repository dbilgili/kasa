<script lang="ts">
	import { fade } from 'svelte/transition';
	import MoreIcon from '$svgs/MoreIcon.svelte';
	import StaticIconButton from './StaticIconButton.svelte';
	import {
		fileId,
		decryptedData,
		masterKey,
		showBin,
		showChangePassword,
		darkMode,
		showAddFolder,
		showManageFolders
	} from '$store';
	import type { DecryptedDataType } from '$types';
	import { updateFile, onToggleDarkMode, validateDecryptedDataShape } from '$functions';
	import { getCSSVariable } from '$libs/getCSSVariable';
	import { toastMessage } from '$libs/toast';

	let showMoreOptionsMenu = false;
	let numberOfDeletedEntries = 0;

	const toggleMoreOptionsMenu = () => {
		showMoreOptionsMenu = !showMoreOptionsMenu;
	};

	const onAddFolder = () => {
		$showAddFolder = true;
		toggleMoreOptionsMenu();
	};

	const manageFolders = () => {
		$showManageFolders = true;
		toggleMoreOptionsMenu();
	};

	const onBinOptionClick = () => {
		$showBin = true;
		toggleMoreOptionsMenu();
	};

	const onExportClick = () => {
		const blob = new Blob([JSON.stringify($decryptedData, undefined, 2)], { type: 'text/json' });
		const link = document.createElement('a');

		link.download = 'kasa-passwords.json';
		link.href = window.URL.createObjectURL(blob);
		link.dataset.downloadurl = ['text/json', link.download, link.href].join(':');

		link.click();
		link.remove();
	};

	const onImportClick = () => {
		(document.querySelector('.file-selector') as HTMLInputElement).click();
	};

	const onJSONFileSelect = (event: Event) => {
		const target = event.target as HTMLInputElement;
		const file = (target.files as FileList)[0];

		if (file) {
			const reader = new FileReader();

			reader.onload = async (e: ProgressEvent<FileReader>) => {
				try {
					const importedData: DecryptedDataType = JSON.parse(e.target?.result as string);
					const testRes = validateDecryptedDataShape(importedData);
					if (testRes) {
						$decryptedData = importedData;
						await updateFile($fileId, $decryptedData, $masterKey);
						showMoreOptionsMenu = false;
					} else {
						toastMessage('error', 'Invalid JSON formatting');
					}
				} catch (error) {
					toastMessage('error', 'Error parsing JSON');
				}
			};

			reader.readAsText(file);
		}
	};

	const onChangePassword = () => {
		$showChangePassword = !$showChangePassword;
		toggleMoreOptionsMenu();
	};

	$: numberOfDeletedEntries = $decryptedData.entries.filter(
		(entry) => entry.deleted === true
	).length;
</script>

{#if showMoreOptionsMenu}
	<button class="overlay" on:click={toggleMoreOptionsMenu} />
{/if}
<div class="more-options">
	<StaticIconButton
		bgColor={$darkMode ? 'black' : 'white'}
		borderColor={$darkMode
			? getCSSVariable('--dark-mode-light-gray')
			: getCSSVariable('--border-gray')}
		padding="6px 8px"
		on:click={toggleMoreOptionsMenu}
	>
		<MoreIcon />
	</StaticIconButton>
	{#if showMoreOptionsMenu}
		<div transition:fade={{ duration: 80 }} class="menu" class:dark-mode={$darkMode}>
			<button on:click={onAddFolder}>Add folder</button>
			<button on:click={manageFolders} disabled={!$decryptedData.folders.length}>
				Manage folders
			</button>
			<div class="separator" />
			<button disabled={numberOfDeletedEntries === 0} on:click={onBinOptionClick}>
				{`Bin (${numberOfDeletedEntries})`}
			</button>
			<div class="separator" />
			<input
				type="file"
				class="file-selector"
				accept="application/json"
				on:change={onJSONFileSelect}
			/>
			<button on:click={onImportClick}>Import</button>
			<button on:click={onExportClick}>Export</button>
			<button on:click={onChangePassword}>Change password</button>
			<div class="separator" />
			<button on:click={onToggleDarkMode}>{$darkMode ? 'Light mode' : 'Dark mode'}</button>
		</div>
	{/if}
</div>

<style lang="scss">
	.overlay {
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		cursor: initial;
		z-index: 2;
	}

	.more-options {
		display: flex;
		position: relative;
		z-index: 2;

		.menu {
			position: absolute;
			right: 0;
			top: 50px;
			width: 170px;
			background-color: white;
			border-radius: 6px;
			border: 1px solid var(--border-gray);
			padding: var(--spacing-10) 0;

			&.dark-mode {
				background-color: black;
				color: var(--gray);
				border-color: var(--dark-mode-light-gray);

				@media (hover: hover) {
					button:hover {
						background-color: var(--dark-mode-hover-gray);
						color: white;
					}
				}
			}

			input {
				display: none;
			}

			button {
				padding: var(--spacing-10) var(--spacing-20);
				width: 100%;
				text-align: left;
				color: inherit;

				&:disabled {
					opacity: 0.5;
				}

				@media (hover: hover) {
					&:hover {
						background-color: var(--hover-gray);
					}
				}
			}

			.separator {
				width: calc(100% - 2 * var(--spacing-20));
				margin: var(--spacing-10) 0;
				margin-left: var(--spacing-20);
				height: 1px;
				background-color: var(--border-gray);
			}
		}
	}
</style>
