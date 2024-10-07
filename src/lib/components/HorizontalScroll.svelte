<script>
	import { cn } from '$lib/utils';
	import { onMount } from 'svelte';

	const { children, class: className, ...restProps } = $props();
	let isDragging = $state(false);
	let startX = $state(0);
	let scrollLeft = $state(0);
	let slider = $state(null);

	onMount(() => {
		if (!slider) return;
		slider.addEventListener('mousemove', handleMouseMove, false);
		slider.addEventListener('mousedown', handleMouseDown, false);
		slider.addEventListener('mouseup', handleMouseUp, false);
		slider.addEventListener('mouseleave', handleMouseUp, false);
	});

	/**
	 * Handles the mouse down event on the horizontal scroll component.
	 * This function is triggered when the user presses the mouse button down.
	 *
	 * @param {MouseEvent} e - The mouse event object.
	 */
	function handleMouseDown(e) {
		isDragging = true;
		startX = e.pageX - slider.offsetLeft;
		scrollLeft = slider.scrollLeft;
	}

	/**
	 * Handles the mouse move event to enable horizontal scrolling.
	 *
	 * @param {MouseEvent} e - The mouse event object.
	 */
	function handleMouseMove(e) {
		e.preventDefault();
		if (!isDragging) return;
		const x = e.pageX - slider.offsetLeft;
		const scroll = x - startX;
		slider.scrollLeft = scrollLeft - scroll;
	}

	/**
	 * Handles the mouse up event.
	 * This function is triggered when the mouse button is released.
	 */
	function handleMouseUp() {
		isDragging = false;
	}
</script>

<div
	class={cn(
		'flex flex-row items-center gap-8 flex-no-wrap overflow-x-auto no-scrollbar',
		className
	)}
	bind:this={slider}
	{...restProps}
>
	{@render children()}
</div>
