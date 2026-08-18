<script lang="ts">
  import { createPushNotification } from "@/hooks/usePushNotification.svelte";
  import { getLocation } from "@/lib/router.svelte";

  const location = getLocation();
  const push = createPushNotification();

  let busy = $state(false);
  let hint = $state<string | null>(null);
  let isSubscribed = $derived(push.isSubscribed);
  let city = $derived(new URLSearchParams(location.state.search).get("city") || "newtaipei");

  $effect(() => {
    push.checkSubscription();
  });

  let isIOS = $derived(
    typeof navigator !== "undefined" && /iPad|iPhone|iPod/.test(navigator.userAgent)
  );
  let isStandalone = $derived(
    typeof window !== "undefined" &&
      ((navigator as unknown as { standalone?: boolean }).standalone === true ||
        window.matchMedia("(display-mode: standalone)").matches)
  );

  async function handleClick() {
    if (busy) return;
    hint = null;
    busy = true;
    try {
      if (push.isSubscribed) {
        await push.unsubscribe();
        hint = "已關閉推播";
        return;
      }
      if (isIOS && !isStandalone) {
        hint = "iOS 請先「加到主畫面」安裝成 App 後才能開啟推播";
        return;
      }
      const ok = await push.subscribe({ city, minutesBefore: 5 });
      hint = ok ? "推播已開啟，垃圾車快到會通知你" : "推播開啟失敗，請允許通知權限";
    } finally {
      busy = false;
    }
  }

  $effect(() => {
    if (!hint) return;
    const t = setTimeout(() => {
      hint = null;
    }, 3500);
    return () => clearTimeout(t);
  });
</script>

<div class="relative flex items-center">
  <button
    onclick={handleClick}
    disabled={busy}
    aria-label={isSubscribed ? "關閉推播提醒" : "開啟推播提醒"}
    title={isSubscribed ? "已開啟推播（點擊關閉）" : "開啟推播提醒"}
    class="h-8 w-8 inline-flex items-center justify-center rounded-full transition-all {isSubscribed
      ? 'bg-green-50 text-green-600 border border-green-200'
      : 'text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 border border-neutral-200'} {busy
      ? 'opacity-50 pointer-events-none'
      : ''}"
  >
    {#if busy}
      <span class="w-3.5 h-3.5 border-2 border-neutral-300 border-t-neutral-500 rounded-full animate-spin"></span>
    {:else}
      <svg
        viewBox="0 0 24 24"
        width="16"
        height="16"
        fill={isSubscribed ? "currentColor" : "none"}
        stroke="currentColor"
        stroke-width="1.8"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    {/if}
  </button>
  {#if hint}
    <div class="absolute top-10 right-0 z-[2100] whitespace-nowrap panel px-3 py-1.5 shadow-lg">
      <p class="text-[11px] text-neutral-600">{hint}</p>
    </div>
  {/if}
</div>