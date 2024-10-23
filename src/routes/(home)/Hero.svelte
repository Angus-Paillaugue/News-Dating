<script>
  import { Button } from '$lib/components';
  import { CARDS_COLORS } from '$lib/constants';
  import { Logo } from '$lib/components/icons';
</script>

<div class="relative">
  <div
    class="absolute inset-2 bottom-0 rounded-[2em] bg-[linear-gradient(115deg,var(--tw-gradient-stops))] sm:bg-[linear-gradient(145deg,var(--tw-gradient-stops))]"
    style="
        --tw-gradient-from: #{CARDS_COLORS[0]} 28%;
        --tw-gradient-to: #{CARDS_COLORS[2]}  var(--tw-gradient-to-position);
        --tw-gradient-stops: var(--tw-gradient-from), #{CARDS_COLORS[4]} 70%, var(--tw-gradient-to);
        "
  ></div>
  <div class="relative px-6 lg:px-8">
    <div class="mx-auto max-w-2xl lg:max-w-7xl">
      <!-- Navbar -->
      <header class="pt-12 sm:pt-16">
        <div
          class="group/row relative isolate flex justify-between pt-[calc(theme(spacing.2)+1px)] last:pb-[calc(theme(spacing.2)+1px)]"
        >
          <div
            aria-hidden="true"
            class="absolute inset-y-0 left-1/2 -z-10 w-screen -translate-x-1/2"
          >
            <div class="absolute inset-x-0 top-0 border-t border-black/5"></div>
            <div class="absolute inset-x-0 top-2 border-t border-black/5"></div>
            <div
              class="absolute inset-x-0 bottom-0 hidden border-b border-black/5 group-last/row:block"
            ></div>
            <div
              class="absolute inset-x-0 bottom-2 hidden border-b border-black/5 group-last/row:block"
            ></div>
          </div>
          <div class="relative flex gap-6">
            <div class="group/item relative py-3">
              <a class="flex items-center gap-2" href="/">
                <Logo class="size-8" />
              </a>
            </div>
          </div>
          <nav class="relative flex">
            <div class="group/item relative flex">
              <svg
                viewBox="0 0 15 15"
                aria-hidden="true"
                class="absolute -left-2 -top-2 hidden size-[15px] fill-black/10 group-first/item:block"
                ><path d="M8 0H7V7H0V8H7V15H8V8H15V7H8V0Z"></path></svg
              ><svg
                viewBox="0 0 15 15"
                aria-hidden="true"
                class="absolute -right-2 -top-2 size-[15px] fill-black/10"
                ><path d="M8 0H7V7H0V8H7V15H8V8H15V7H8V0Z"></path></svg
              ><svg
                viewBox="0 0 15 15"
                aria-hidden="true"
                class="absolute -bottom-2 -left-2 hidden size-[15px] fill-black/10 group-last/row:group-first/item:block"
                ><path d="M8 0H7V7H0V8H7V15H8V8H15V7H8V0Z"></path></svg
              ><svg
                viewBox="0 0 15 15"
                aria-hidden="true"
                class="absolute -bottom-2 -right-2 hidden size-[15px] fill-black/10 group-last/row:block"
                ><path d="M8 0H7V7H0V8H7V15H8V8H15V7H8V0Z"></path></svg
              ><a
                class="flex items-center px-4 py-3 text-base font-medium text-gray-950 bg-blend-multiply data-[hover]:bg-black/[2.5%]"
                href="/log-in">Login</a
              >
            </div>
          </nav>
        </div>
      </header>

      <!-- Main content -->
      <div class="pb-24 pt-16 sm:pb-32 sm:pt-24 md:pb-48 md:pt-32">
        <h1
          class="text-balance font-body text-6xl/[0.9] font-medium tracking-tight text-gray-950 sm:text-8xl/[0.8]"
        >
          Your News, Your Way
        </h1>
        <p
          class="mt-8 max-w-lg text-xl/7 font-medium text-gray-950/75 sm:text-2xl/8"
        >
          Get all the latest news from many sources in a beautiful, easy to use
          interface.
        </p>
        <div class="mt-12 flex flex-row gap-x-6 gap-y-4">
          <Button class="inline-flex w-fit" href="/log-in">Get started</Button>
          <!-- <Button
            class="inline-flex w-fit"
            variant="secondary"
            href="#more-infos">More infos</Button
          > -->
        </div>
      </div>
    </div>
  </div>
</div>
