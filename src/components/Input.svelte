<script lang="ts">
	import { copyToClipboard } from '$libs/copyToClipboard';
	import HideIcon from '$svgs/HideIcon.svelte';
	import ShowIcon from '$svgs/ShowIcon.svelte';
	import CopyIcon from '$svgs/CopyIcon.svelte';
	import GenerateIcon from '$svgs/GenerateIcon.svelte';
	import { darkMode } from '$store';
	import { toastMessage } from '$libs/toast';
	import { nanoid } from 'nanoid';
	import OpenInBrowser from '$svgs/OpenInBrowser.svelte';

	export let value: string = '';
	export let element: HTMLInputElement | null = null;
	export let disabled: boolean = false;
	export let isPassword: boolean = false;
	export let withCopy: boolean = false;
	export let withOpenUrl: boolean = false;
	export let withGeneratePassword: boolean = false;

	let showPassword: boolean = false;

	const copyToClipboardHandler = () => {
		copyToClipboard(value);
		toastMessage('success', 'Copied to clipboard');
	};

	const generatePasswordHandler = () => {
		value = nanoid(20);
		showPassword = true;
	};

	const toggleShowPassword = () => {
		showPassword = !showPassword;

		// element?.focus();
		// // A hacky solution to move the cursor to the end of the input
		// setTimeout(() => {
		// 	// @ts-ignore
		// 	element.selectionStart = element.selectionEnd = value.length;
		// });
	};

	const openLink = () => {
		const password = (document.getElementsByName('no-search-password')[0] as HTMLInputElement)
			.value;
		copyToClipboard(password);

		let url = value;
		if (!value.match(/^https?:\/\//i)) {
			url = 'http://' + url;
		}
		try {
			window.open(url, '_blank');
		} catch (error) {
			toastMessage('error', 'Error opening the link');
		}
	};

	$: if (isPassword) {
		element?.setAttribute('type', showPassword ? 'text' : 'password');
	}
</script>

<div class="wrapper">
	<input
		bind:this={element}
		bind:value
		on:input
		{disabled}
		{...$$restProps}
		class={$$props.class}
		class:dark-mode={$darkMode}
	/>
	<div class="buttons-wrapper" class:dark-mode={$darkMode}>
		{#if isPassword}
			<button class="password-toggle-button" type="button" on:click={toggleShowPassword}>
				{#if showPassword}
					<HideIcon />
				{:else}
					<ShowIcon />
				{/if}
			</button>
		{/if}
		{#if withCopy}
			<button
				class="password-copy-button"
				type="button"
				on:click={copyToClipboardHandler}
				disabled={!value.length}
			>
				<CopyIcon />
			</button>
		{/if}
		{#if withGeneratePassword}
			<button
				class="password-generate-button"
				type="button"
				on:click={generatePasswordHandler}
				{disabled}
			>
				<GenerateIcon />
			</button>
		{/if}
		{#if withOpenUrl}
			<button
				class="open-in-browser-button"
				type="button"
				on:click={openLink}
				disabled={!value.length}
			>
				<OpenInBrowser />
			</button>
		{/if}
	</div>
</div>

<style lang="scss">
	.wrapper {
		display: flex;
		position: relative;
		width: 100%;

		.buttons-wrapper {
			display: flex;
			position: absolute;
			top: 0;
			bottom: 0;
			right: var(--spacing-10);

			&.dark-mode > button:hover {
				background-color: var(--dark-mode-light-gray);
			}

			& > button {
				display: flex;
				align-items: center;
				margin: 5px 0;
				padding: 6px;
				border-radius: 6px;
				color: var(--gray);

				&:hover {
					background-color: var(--light-gray);
				}
			}
		}

		& > input {
			padding-right: 10px;
		}
	}

	input[type='search'] {
		&::-webkit-search-cancel-button {
			-webkit-appearance: none;
			height: 15px;
			width: 15px;
			padding-right: 15px;
			background: url('../svgs/x-circle-black.svg') no-repeat 50% 50%;
			background-size: contain;
			cursor: pointer;
			opacity: 1;
			pointer-events: all;
		}

		&::-webkit-search-decoration {
			-webkit-appearance: none;
		}
	}

	input {
		background-color: white;
		font-family: var(--font-fragment-mono);
		color: black;
		border: 1px solid var(--hover-gray);
		background-color: var(--hover-gray);
		border-radius: 6px;
		padding: 0;
		padding-left: var(--spacing-10);
		font-size: var(--font-size-14);
		height: 40px;
		width: -webkit-fill-available;

		&::-webkit-contacts-auto-fill-button {
			visibility: hidden;
			position: absolute;
			right: 0;
		}

		&::-webkit-credentials-auto-fill-button {
			visibility: hidden;
			position: absolute;
			right: 0;
		}

		&:focus {
			outline: none;
			/* background-color: white; */
			/* border-color: var(--light-gray); */
		}

		&:disabled,
		&:read-only {
			cursor: not-allowed;
			color: var(--gray);
		}

		&::placeholder {
			color: var(--placeholder-gray);
		}

		&.taller {
			height: 43px;
		}

		&.centered-text {
			padding-left: 0;
			text-align: center;
			width: 100%;
		}

		&.dark-mode {
			background-color: var(--dark-mode-gray);
			border-color: var(--dark-mode-gray);
			color: white;

			&:disabled,
			&:read-only {
				color: var(--gray);
			}

			&[type='search']::-webkit-search-cancel-button {
				background: url('../svgs/x-circle-white.svg') no-repeat 50% 50%;
			}
		}
	}
</style>
