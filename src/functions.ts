import {
	cipherText,
	decryptedData,
	locked,
	masterKey,
	darkMode,
	fileId,
	showBin,
	showEntrySidebar,
	defaultDecryptedData
} from '$store';
import type { DecryptedDataType } from '$types';
import { decrypt, encrypt } from '$crypto';
import { invalidateAll } from '$app/navigation';
import { v4 as uuidv4 } from 'uuid';

export const addEntryToFolder = (folderId: string, entryId: string) => {
	decryptedData.update((ps) => {
		const folderIndex = ps.folders.findIndex((folder) => folder.id === folderId);
		if (folderIndex === -1) {
			return ps;
		}

		ps.folders[folderIndex].contentIds.push(entryId);
		return ps;
	});
};

export const removeEntryFromFolder = (folderId: string, entryId: string) => {
	decryptedData.update((ps) => {
		const folderIndex = ps.folders.findIndex((folder) => folder.id === folderId);
		if (folderIndex === -1) {
			return ps;
		}

		ps.folders[folderIndex].contentIds = ps.folders[folderIndex].contentIds.filter(
			(id) => id !== entryId
		);

		const entryIndex = ps.entries.findIndex((entry) => entry.id === entryId);
		if (entryIndex === -1) {
			return ps;
		}

		ps.entries[entryIndex].folderId = '';

		return ps;
	});
};

export const validateDecryptedDataShape = (input: DecryptedDataType) => {
	if (typeof input !== 'object' || input === null) {
		return false;
	}

	// Check dataModelVersion
	if (typeof input.dataModelVersion !== 'number') {
		return false;
	}

	// Check folders array
	if (!Array.isArray(input.folders)) {
		return false;
	}
	for (const folder of input.folders) {
		if (
			typeof folder.id !== 'string' ||
			typeof folder.name !== 'string' ||
			!Array.isArray(folder.contentIds) ||
			!folder.contentIds.every((id) => typeof id === 'string')
		) {
			return false;
		}
	}

	// Check entries array
	if (!Array.isArray(input.entries)) {
		return false;
	}
	for (const entry of input.entries) {
		if (
			typeof entry.id !== 'string' ||
			typeof entry.folderId !== 'string' ||
			typeof entry.deleted !== 'boolean' ||
			!Array.isArray(entry.versions)
		) {
			return false;
		}

		for (const version of entry.versions) {
			if (
				typeof version.id !== 'string' ||
				typeof version.version !== 'number' ||
				typeof version.name !== 'string' ||
				typeof version.createdAt !== 'string' ||
				('identifier' in version && typeof version.identifier !== 'string') ||
				('password' in version && typeof version.password !== 'string') ||
				('url' in version && typeof version.url !== 'string') ||
				('notes' in version && typeof version.notes !== 'string')
			) {
				return false;
			}
		}
	}

	return true;
};

export const isDarkMode = () => {
	const localValue = localStorage.getItem('dark-mode');

	if (localValue) {
		darkMode.set(localValue === 'true');
		if (localValue === 'true') {
			window.document.body.classList.add('dark-mode');
		} else {
			window.document.body.classList.remove('dark-mode');
		}
	} else {
		darkMode.set(false);
		window.document.body.classList.remove('dark-mode');
	}
};

export const onToggleDarkMode = () => {
	darkMode.update((ps) => !ps);
	window.document.body.classList.toggle('dark-mode');

	const unsubscribe = darkMode.subscribe((val) =>
		localStorage.setItem('dark-mode', val ? 'true' : 'false')
	);
	unsubscribe();
};

export const unlock = (cipherText: string, masterKey: string) => {
	try {
		const res = decrypt(cipherText, masterKey);

		decryptedData.set(res);
		locked.set(false);
	} catch {
		throw new Error('Invalid master key');
	}
};

export const lock = () => {
	decryptedData.set(defaultDecryptedData);
	locked.set(true);
	masterKey.set('');
	showBin.set(false);
	showEntrySidebar.set(false);
	invalidateAll();
};

export const createFile = async (masterKey: string) => {
	const generatedCipherText = encrypt(defaultDecryptedData, masterKey);
	const response = await fetch('/api/createFile', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ generatedCipherText, masterKey })
	});

	if (!response.ok) {
		throw new Error('Something went wrong while creating the file');
	}

	const { id } = await response.json();

	if (id) {
		fileId.set(id);
	}

	cipherText.set(generatedCipherText);
	decryptedData.set(defaultDecryptedData);
};

export const getFile = async () => {
	const response = await fetch('/api/getFile', {
		method: 'GET'
	});

	if (!response.ok) {
		throw new Error('Something went wrong while creating the file');
	}

	decryptedData.set(defaultDecryptedData);
};

export const updateFile = async (
	fileId: string,
	decryptedData: DecryptedDataType,
	masterKey: string
) => {
	const generatedCipherText = encrypt(decryptedData, masterKey);
	const response = await fetch('/api/updateFile', {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			fileId,
			cipherText: generatedCipherText,
			masterKey
		})
	});

	if (!response.ok) {
		throw new Error('Something went wrong while updating the file');
	}

	cipherText.set(generatedCipherText);
};

export const updatePassword = async (
	fileId: string,
	decryptedData: DecryptedDataType,
	masterKey: string,
	newMasterKey: string
) => {
	const generatedCipherText = encrypt(decryptedData, newMasterKey);
	const response = await fetch('/api/updatePassword', {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			fileId,
			masterKey,
			newMasterKey,
			cipherText: generatedCipherText
		})
	});

	if (!response.ok) {
		throw new Error('Something went wrong while updating the password');
	}
};
