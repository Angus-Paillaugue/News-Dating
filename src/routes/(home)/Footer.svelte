<script>
  import { Button } from '$lib/components';
  import { CARDS_COLORS } from '$lib/constants';
  import { Logo } from '$lib/components/icons';
</script>

<footer>
  <div class="relative">
    <div
      class="absolute inset-2 rounded-[2em] bg-[linear-gradient(115deg,var(--tw-gradient-stops))] sm:bg-[linear-gradient(145deg,var(--tw-gradient-stops))]"
      style="
        --tw-gradient-from: #{CARDS_COLORS[0]} 28%;
        --tw-gradient-to: #{CARDS_COLORS[2]}  var(--tw-gradient-to-position);
        --tw-gradient-stops: var(--tw-gradient-from), #{CARDS_COLORS[4]} 70%, var(--tw-gradient-to);
        "
    ></div>
    <div class="px-6 lg:px-8">
      <div class="mx-auto max-w-2xl lg:max-w-7xl">
        <div class="relative pb-16 pt-20 text-center sm:py-24">
          <hgroup>
            <h2
              class="font-mono text-xs/5 font-semibold uppercase tracking-widest text-gray-500"
            >
              Get started
            </h2>
            <p
              class="mt-6 text-3xl font-medium tracking-tight text-gray-950 sm:text-5xl"
            >
              Ready to dive in?<br />Start today.
            </p>
          </hgroup>
          <p class="mx-auto mt-6 max-w-xs text-sm/6 text-gray-500">
            Get all the latest news from many sources in a beautiful, easy to
            use interface.
          </p>
          <div class="mt-6">
            <Button class="mx-auto w-fit" href="/sign-in">Get started</Button>
          </div>
        </div>
        <div class="pb-16">
          <div
            class="group/row relative isolate flex justify-start pt-[calc(theme(spacing.2)+1px)] last:pb-[calc(theme(spacing.2)+1px)]"
          >
            <div
              class="group/item relative flex flex-row items-center justify-center px-8"
            >
              <svg
                viewBox="0 0 15 15"
                aria-hidden="true"
                class="absolute -left-2 -top-2 hidden size-[15px] fill-black/10 group-first/item:block"
                ><path d="M8 0H7V7H0V8H7V15H8V8H15V7H8V0Z"></path></svg
              ><svg
                viewBox="0 0 15 15"
                aria-hidden="true"
                class="absolute -bottom-2 -left-2 hidden size-[15px] fill-black/10 group-last/row:group-first/item:block"
                ><path d="M8 0H7V7H0V8H7V15H8V8H15V7H8V0Z"></path></svg
              >
              <Logo class="size-9" />
            </div>
            <div
              aria-hidden="true"
              class="absolute inset-y-0 left-1/2 -z-10 w-screen -translate-x-1/2"
            >
              <div
                class="absolute inset-x-0 top-0 border-t border-black/5"
              ></div>
              <div
                class="absolute inset-x-0 top-2 border-t border-black/5"
              ></div>
              <div
                class="absolute inset-x-0 bottom-0 hidden border-b border-black/5 group-last/row:block"
              ></div>
              <div
                class="absolute inset-x-0 bottom-2 hidden border-b border-black/5 group-last/row:block"
              ></div>
            </div>
            <div>
              <div class="group/item relative px-6 py-3">
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
                >
                <div class="text-sm/6 text-gray-950">
                  © {new Date().getFullYear()} News Dating.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</footer>
