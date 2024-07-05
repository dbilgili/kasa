function isClipboardApiSupported() {
	return navigator.clipboard && navigator.clipboard.writeText;
}

function copyToClipboard(text: string) {
	if (isClipboardApiSupported()) {
		// Use Clipboard API if available
		navigator.clipboard
			.writeText(text)
			.then(() => {
				console.log('Text copied to clipboard successfully!');
			})
			.catch((error) => {
				console.error('Failed to copy text: ', error);
				fallbackCopyToClipboard(text); // Fallback for possible errors
			});
	} else {
		// Fallback for browsers that do not support Clipboard API
		fallbackCopyToClipboard(text);
	}
}

function fallbackCopyToClipboard(text: string) {
	const textArea = document.createElement('textarea');
	textArea.value = text;
	textArea.style.position = 'fixed'; // Prevent scrolling to bottom of page
	document.body.appendChild(textArea);
	textArea.focus();
	textArea.select();

	try {
		const successful = document.execCommand('copy');
		const msg = successful ? 'Text copied to clipboard successfully!' : 'Failed to copy text.';
		console.log(msg);
	} catch (error) {
		console.error('Failed to copy text: ', error);
	}

	document.body.removeChild(textArea);
}

export { copyToClipboard };
