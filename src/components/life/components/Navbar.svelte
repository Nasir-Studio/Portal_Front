<script lang="ts">
  import type { Snippet } from "svelte";
  import PushBell from "./PushBell.svelte";
  import Link from "./Link.svelte";
  import { getLocation } from "@/lib/router.svelte";

  let { transparent = false, children }: { transparent?: boolean; children?: Snippet } = $props();

  const location = getLocation();
  let scrolled = $state(false);

  $effect(() => {
    if (!transparent) return;
    const onScroll = () => {
      scrolled = window.scrollY > 20;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  });

  let pathname = $derived(location.state.pathname);
  let isTrash = $derived(
    pathname.startsWith("/trash") || pathname.startsWith("/track") || pathname.startsWith("/schedule")
  );
  let isBus = $derived(pathname.startsWith("/bus"));

  let navBg = $derived(
    transparent
      ? scrolled
        ? "bg-white border-b border-neutral-100"
        : "bg-transparent"
      : "bg-white border-b border-neutral-100"
  );
</script>

<header class="fixed top-0 left-0 right-0 z-[2000] transition-all duration-300 {navBg}">
  <div class="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
    <div class="flex items-center gap-5">
      <Link to="/" class="text-[13px] font-medium text-neutral-900 tracking-tight">
        活這真好
      </Link>
      <div class="hidden sm:flex items-center gap-1">
        <Link
          to="/trash"
          class="h-8 px-3 inline-flex items-center text-[12px] rounded-full transition-all {isTrash
            ? 'bg-neutral-900 text-white'
            : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'}"
        >
          我逝垃圾
        </Link>
        <Link
          to="/bus"
          class="h-8 px-3 inline-flex items-center text-[12px] rounded-full transition-all {isBus
            ? 'bg-neutral-900 text-white'
            : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'}"
        >
          雙北中公車
        </Link>
      </div>
    </div>
    <div class="flex items-center gap-3">
      <PushBell />
      {@render children?.()}
      <Link
        to="/trash"
        class="sm:hidden h-8 px-3 inline-flex items-center text-[12px] rounded-full transition-all {isTrash
          ? 'bg-neutral-900 text-white'
          : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'}"
      >
        垃圾
      </Link>
      <Link
        to="/bus"
        class="sm:hidden h-8 px-3 inline-flex items-center text-[12px] rounded-full transition-all {isBus
          ? 'bg-neutral-900 text-white'
          : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'}"
      >
        公車
      </Link>
    </div>
  </div>
</header>