import type { DecryptedDataType, EntryType } from '$types';
import { writable } from 'svelte/store';

export const defaultDecryptedData = { dataModelVersion: 1, folders: [], entries: [] };

export const fileId = writable('');
export const cipherText = writable('');
export const masterKey = writable('');
export const locked = writable<boolean | null>(null);
export const decryptedData = writable<DecryptedDataType>(defaultDecryptedData);
export const selectedEntry = writable<EntryType | null>(null);
export const showEntrySidebar = writable(false);
export const screenSize = writable({ small: false, medium: false, large: false, value: 0 });
export const lastDeletedEntryId = writable('');
export const showBin = writable(false);
export const showChangePassword = writable(false);
export const showAddFolder = writable(false);
export const showManageFolders = writable(false);
export const darkMode = writable(false);
export const selectedFolderId = writable('');
