<script>
  import '../app.css';
  import { Analytics } from '$lib/components';

  const { children } = $props();
</script>

<Analytics />

{@render children()}
