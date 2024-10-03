<script>
  import { getContext } from 'svelte';

  const { children, ...restProps } = $props();
  const { toggle } = getContext('dropdown');
</script>

<button onclick={toggle} name="Toggle dropdown" {...restProps}>
  {@render children()}
</button>
