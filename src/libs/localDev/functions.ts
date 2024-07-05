import fs from 'fs/promises';

export const createWriteLocalTextFile = async (cipherText: string) => {
	await fs.writeFile('local-vault.txt', cipherText, 'utf-8');
};

export const readLocalTextFile = async () => {
	try {
		const cipherText = await fs.readFile('local-vault.txt', 'utf-8');
		return { fileId: '', cipherText };
	} catch {
		return { fileId: '', cipherText: '' };
	}
};
