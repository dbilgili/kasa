import type { DecryptedDataType } from '$types';
import CryptoJS from 'crypto-js';

export const encrypt = (decryptedData: unknown, masterKey: string) => {
	return CryptoJS.AES.encrypt(JSON.stringify(decryptedData), masterKey).toString();
};

export const decrypt = (ciphertext: string, masterKey: string): DecryptedDataType => {
	const bytes = CryptoJS.AES.decrypt(ciphertext, masterKey);
	return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};

export const generateSalt = () => CryptoJS.lib.WordArray.random(128 / 8).toString(CryptoJS.enc.Hex);

export const hashString = (salt: string, str: string) => CryptoJS.SHA256(salt + str).toString();
