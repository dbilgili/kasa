export interface EntryType {
	id: string;
	folderId: string;
	deleted: boolean;
	versions: VersionType[];
}

export interface VersionType {
	id: string;
	version: number;
	name: string;
	identifier?: string;
	password?: string;
	url?: string;
	notes?: string;
	createdAt: Date;
}

export interface FolderType {
	id: string;
	name: string;
	contentIds: string[];
}

export interface DecryptedDataType {
	dataModelVersion: number;
	folders: FolderType[];
	entries: EntryType[];
}
