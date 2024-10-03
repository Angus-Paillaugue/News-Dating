<script>
	import { cn } from '$lib/utils';
	const { class: className, children, href, style = 'default', ...props } = $props();

	const baseClasses =
		'flex flex-row items-center justify-center text-lg font-medium gap-2 w-full px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all';

	const styleClasses = {
		default: 'bg-neutral-800 text-text-heading-dark rounded-full',
		danger: ' bg-red-600 text-text-heading-dark rounded-xl'
	};
</script>

{#if href}
	<a {href} class={cn(baseClasses, styleClasses[style], className)} {...props}>
		{@render children()}
	</a>
{:else}
	<button class={cn(baseClasses, styleClasses[style], className)} {...props}>
		{@render children()}
	</button>
{/if}
