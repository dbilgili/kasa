export const getCSSVariable = (name: string) => {
	if (typeof document !== 'undefined') {
		const root = document.querySelector(':root') as Element;
		const style = getComputedStyle(root);
		return style.getPropertyValue(name);
	}

	return '';
};
