<script>
  import { bionicReadingEnabled } from '$lib/stores';
  import { browser } from '$app/environment';
  import Navbar from './Navbar.svelte';

  const { children } = $props();

  // Set the font weight based on the bionic reading setting
  bionicReadingEnabled.subscribe((value) => {
    if (!browser) return;
    document.body.style.setProperty('--br-weight', value ? '700' : 'inherit');
  });
</script>

<div class="flex min-h-screen flex-col">
  <div class="flex grow flex-col">
    {@render children()}
  </div>

  <Navbar />
</div>
