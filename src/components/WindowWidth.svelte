<script lang="ts">
	import { getCSSVariable } from '$libs/getCSSVariable';
	import { screenSize } from '$store';
	let innerWidth = 0;

	let bpSmall = parseInt(getCSSVariable('--bp-small').split('px')[0]);
	let bpMedium = parseInt(getCSSVariable('--bp-medium').split('px')[0]);
	let bpLarge = parseInt(getCSSVariable('--bp-large').split('px')[0]);

	$: {
		$screenSize.value = innerWidth;
		$screenSize.small = innerWidth <= bpSmall;
		$screenSize.medium = innerWidth > bpSmall && innerWidth <= bpMedium;
		$screenSize.large = innerWidth > bpMedium && innerWidth <= bpLarge;
	}
</script>

<svelte:window bind:innerWidth />
