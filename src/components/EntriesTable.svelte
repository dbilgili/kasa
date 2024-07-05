<script lang="ts">
	import ChevronDown from '$svgs/ChevronDown.svelte';
	import ChevronUp from '$svgs/ChevronUp.svelte';
	import FolderIcon from '$svgs/FolderIcon.svelte';
	import type { EntryType, FolderType } from '$types';
	import {
		selectedEntry,
		showEntrySidebar,
		screenSize,
		darkMode,
		showBin,
		selectedFolderId
	} from '$store';
	import { onMount } from 'svelte';
	import { disablePageScroll } from 'scroll-lock';
	import MoreIcon from '$svgs/MoreIcon.svelte';
	import StaticIconButton from './StaticIconButton.svelte';

	export let entries: EntryType[];
	export let folders: FolderType[];

	let openFolderIds: string[] = [];

	onMount(() => {
		const table = document.querySelector('.table-fix-head');
		disablePageScroll(table);
	});

	const getEntryById = (id: string): EntryType => entries.find((entry) => entry.id === id)!;

	const setSelectedEntry = (id: string) => {
		$selectedEntry = entries.find((entry) => entry.id === id) as EntryType;
		$showEntrySidebar = true;
	};

	const updateOpenFolderIds = (id: string) => {
		if (openFolderIds.includes(id)) {
			openFolderIds = openFolderIds.filter((folderId) => folderId !== id);
		} else {
			openFolderIds.push(id);
			openFolderIds = openFolderIds;
		}
	};
</script>

{#if entries.length}
	<div class="table-fix-head" class:dark-mode={$darkMode}>
		<table>
			{#if !$screenSize.small}
				<thead>
					<tr>
						<th>Name</th>
						<th>Identifier</th>
						<th>Date Created</th>
					</tr>
				</thead>
			{/if}

			<tbody>
				{#if !$showBin}
					{#each folders as { id, name, contentIds }}
						<tr on:click={() => updateOpenFolderIds(id)}>
							<td>
								<div class="centered-td-content">
									{#if openFolderIds.includes(id)}
										<ChevronUp />
									{:else}
										<ChevronDown />
									{/if}
									<FolderIcon />
									<span>{name}</span>
									{#if !$screenSize.small}
										<div class="separator" class:dark-mode={$darkMode} />
									{/if}
									<StaticIconButton
										on:click={() => ($selectedFolderId = id)}
										bgColor="none"
										borderColor="none"
										padding="10px"
										margin={$screenSize.small ? '0 0 0 auto' : '0'}
									>
										<MoreIcon />
									</StaticIconButton>
								</div>
							</td>
							<td />
							<td />
						</tr>

						{#if openFolderIds.includes(id)}
							{#each contentIds as contentId}
								<tr
									on:click={() => setSelectedEntry(contentId)}
									class:selected={$selectedEntry?.id === contentId && $showEntrySidebar}
									class="in-folder-entry-tr"
								>
									<td class="in-folder-entry">
										• {getEntryById(contentId)?.versions?.at(-1)?.name}</td
									>
									<td>{getEntryById(contentId).versions?.at(-1)?.identifier}</td>
									<td
										>{new Date(
											getEntryById(contentId)?.versions?.at(-1)?.createdAt ?? ''
										).toLocaleDateString()}</td
									>
								</tr>
							{/each}
						{/if}
					{/each}
				{/if}

				{#each entries as { id, versions, folderId }}
					{#if !folderId}
						<tr
							on:click={() => setSelectedEntry(id)}
							class:selected={$selectedEntry?.id === id && $showEntrySidebar}
						>
							<td>{versions[versions.length - 1].name}</td>
							<td>{versions[versions.length - 1].identifier}</td>
							<td>{new Date(versions[versions.length - 1].createdAt).toLocaleDateString()}</td>
						</tr>
					{/if}
				{/each}
			</tbody>
		</table>
	</div>
{:else}
	<div class="no-match">{`No entries found`}</div>
{/if}

<style lang="scss">
	.no-match {
		display: flex;
		margin: 0 auto;
		justify-content: center;
		margin: var(--spacing-50) 0;
	}

	.table-fix-head {
		overflow: scroll;
		z-index: 10;
		height: calc(100svh - 165px);

		@media (width <= $bp-large) {
			height: calc(100svh - 85px - var(--spacing-50));
		}

		&.dark-mode {
			border-color: black;

			thead {
				th {
					background-color: black;

					&::after {
						background-color: var(--dark-mode-gray);
					}
				}
			}

			tbody {
				tr {
					&.selected {
						text-decoration: underline;
					}

					&:not(:last-of-type) {
						border-color: var(--dark-mode-gray);
					}

					@media (hover: hover) {
						&:hover {
							background-color: var(--dark-mode-hover-gray);
						}
					}
				}
			}
		}

		table {
			border-collapse: collapse;
			width: 100%;
			overflow-y: scroll;

			thead {
				th {
					background-color: white;
					position: sticky;
					top: 0;
					padding-bottom: var(--spacing-25);
					z-index: 1;
					text-decoration: underline;

					&::after {
						content: '';
						position: absolute;
						left: 0;
						bottom: 0;
						width: 100%;
						height: 1px;
						background-color: var(--light-gray);
						pointer-events: none;
					}
				}
			}

			tbody {
				th {
					text-decoration: underline;
				}

				tr {
					color: inherit;
					cursor: pointer;

					@media (hover: hover) {
						&:hover {
							background-color: var(--hover-gray);
						}
					}

					&:not(:last-of-type) {
						border-bottom: 1px solid var(--light-gray);
					}

					&.selected {
						cursor: initial;

						@media (hover: hover) {
							&:hover {
								background-color: unset;
							}
						}
					}
				}
			}
		}

		.folder-name {
			display: flex;
			justify-content: center;
		}

		.centered-td-content {
			display: flex;
			align-items: center;
			column-gap: var(--spacing-5);

			.separator {
				border-left: 1px solid var(--border-gray);
				height: 25px;
				color: gray;
				margin-left: var(--spacing-15);

				&.dark-mode {
					border-color: var(--dark-mode-light-gray);
				}
			}

			/* .folder-more-button {
				display: flex;
				align-items: center;
				height: 40px;
				padding: 0 10px;
				margin: 0;
				border-radius: 10px;
				border: 1px solid red;
			} */
		}

		.in-folder-entry-tr {
			&:last-of-type {
				border-bottom-color: red !important;
			}
		}

		.in-folder-entry {
			padding-left: 15px !important;
		}

		td {
			height: 48px;
		}

		td,
		th {
			text-align: left;
			max-width: 50px;
			overflow-wrap: break-word;
			transition: all 200ms;

			&:first-of-type {
				width: 40%;
				padding-left: var(--spacing-10);

				@media (width <= $bp-small) {
					padding-left: 0;
				}
			}

			&:nth-of-type(2) {
				padding-left: var(--spacing-10);
				width: 40%;

				@media (width <= $bp-medium) {
					text-align: right;
					padding-right: var(--spacing-20);
				}

				@media (width <= $bp-small) {
					display: none;
				}
			}

			&:last-of-type {
				text-align: right;
				padding-right: var(--spacing-20);
				width: 20%;

				@media (width <= $bp-medium) {
					display: none;
				}
			}
		}
	}
</style>
