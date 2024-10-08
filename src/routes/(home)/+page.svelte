<script>
	import { Card, Button } from '$lib/components';
	import { CARDS_COLORS } from '$lib/constants';
	import { onMount } from 'svelte';

	let heroCard = $state();
	const CARD_ROTATION_FACTOR = 10;
	let heroCardData = {
		img: 'https://media.licdn.com/dms/image/v2/C5603AQHGcJGjePdGEQ/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1517072736310?e=1733356800&v=beta&t=Yg1ASgdPhlcQx5vN1JkMfNghFSRd_eHGnUUQFkICLvg',
		title: 'Patrick',
		description: 'test',
		date: new Date(),
		color: CARDS_COLORS[1]
	};

	onMount(() => {
		document.body.style.setProperty('--br-weight', 700);
	});

	/**
	 * Handles the touch start event.
	 *
	 * @param {TouchEvent} event - The touch event object.
	 */
	function handleTouchStart(event) {
		const touch = (event?.touches && event?.touches[0]) ?? {
			clientX: event.clientX,
			clientY: event.clientY
		};
		heroCardData.startX = touch.clientX;
		heroCardData.currentX = touch.clientX;
		heroCardData.currentY = touch.clientY;
		heroCardData.startY = touch.clientY;
	}

	/**
	 * Handles the touch move event.
	 *
	 * @param {TouchEvent} event - The touch event object.
	 */
	function handleTouchMove(event) {
		if (!heroCardData.startX || !heroCardData.startY) return;
		const touch = (event?.touches && event?.touches[0]) ?? {
			clientX: event.clientX,
			clientY: event.clientY
		};
		heroCardData.currentX = touch.clientX;
		heroCardData.currentY = touch.clientY;
		const diffX = heroCardData.currentX - heroCardData.startX;
		const diffY = heroCardData.currentY - heroCardData.startY;
		const rotation = diffX / CARD_ROTATION_FACTOR;
		heroCard.style.transform = `translateX(${diffX}px) translateY(${diffY}px) rotate(${rotation}deg)`;
	}

	/**
	 * Handles the touch end event.
	 * This function is triggered when a touch event ends.
	 */
	function handleTouchEnd() {
		const _DURATION = 300;
		const _BASE_DURATION = heroCard.style.transitionDuration;
		heroCard.style.transitionDuration = `${_DURATION}ms`;
		heroCard.style.transform = 'translateX(0) translateY(0) rotate(0)';
		heroCardData.startX = null;
		heroCardData.startY = null;
		setTimeout(() => {
			heroCard.style.transitionDuration = _BASE_DURATION;
		}, _DURATION);
	}
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<svelte:window onmousemove={handleTouchMove} />

<div class="bg-body-dark rounded-3xl w-full p-4 h-[calc(100vh-85px)] relative">
	<!-- <img src="/heroCircle.svg" alt="" class="absolute left-1/2 -translate-x-1/2 bottom-0 w-full"> -->
	<div class="max-w-screen-2xl mx-auto h-full w-full flex flex-col">
		<div
			class="max-w-screen-lg mx-auto grow w-full gap-8 grid grid-cols-1 lg:grid-cols-2 h-full items-center"
		>
			<div class="flex flex-col max-lg:items-center gap-4">
				<h1 class="text-2xl font-bold text-text-heading-dark">News Dating</h1>

				<Button class="w-fit px-8" href="/log-in">Get started</Button>
			</div>
			<div class="w-full h-full flex flex-col items-center justify-center relative">
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div
					class="transition-transform h-fit w-full z-50 flex flex-col items-center justify-center"
					bind:this={heroCard}
					style="transition-duration: 75ms; transform: translateX(0) translateY(0);"
					ontouchstart={handleTouchStart}
					ontouchmove={handleTouchMove}
					ontouchend={handleTouchEnd}
					onmousedown={handleTouchStart}
					onmouseup={handleTouchEnd}
					onmouseleave={handleTouchEnd}
				>
					<Card article={heroCardData} class="h-fit w-full grow" />
				</div>
			</div>
		</div>
	</div>
</div>

<!-- <div class="bg-white h-[calc(100vh-85px)] rounded-3xl w-full mt-10 p-4">
    <div class="max-w-screen-2xl mx-auto w-full flex flex-col">

    </div>
</div> -->

<div class="px-4 py-36 mt-10 bg-body-dark rounded-3xl">
	<div class="mx-auto flex flex-col items-center justify-center"></div>
</div>
