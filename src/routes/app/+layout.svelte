<script>
	import { bionicReadingEnabled } from '$lib/stores';
	import { browser } from '$app/environment';
	import Navbar from './Navbar.svelte';

	const { children } = $props();

	bionicReadingEnabled.subscribe((value) => {
		if (!browser) return;
		document.body.style.setProperty('--br-weight', value ? '700' : 'inherit');
	});
</script>

<div class="min-h-screen flex flex-col">
	<div class="grow flex flex-col">
		{@render children()}
	</div>

	<Navbar />
</div>
