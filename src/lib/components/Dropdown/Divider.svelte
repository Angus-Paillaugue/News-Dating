<script>
  import { cn } from '$lib/utils';

  const { class: className, ...restProps } = $props();
</script>

<div
  class={cn(
    'my-2 h-0 w-full border-b border-neutral-600',
    className
  )}
  {...restProps}
></div>
