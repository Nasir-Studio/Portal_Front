<script lang="ts">
  import { onMount } from "svelte";
  import Link from "@/components/Link.svelte";
  import Navbar from "@/components/Navbar.svelte";

  let opened = $state(false);
  let phase = $state<"enter" | "hold" | "exit">("enter");

  onMount(() => {
    const t1 = setTimeout(() => (phase = "hold"), 800);
    const t2 = setTimeout(() => (phase = "exit"), 1800);
    const t3 = setTimeout(() => (opened = true), 2600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  });
</script>

<div class="min-h-screen bg-white">
  {#if !opened}
    <div
      class="fixed inset-0 z-50 flex items-center justify-center bg-white transition-opacity duration-700 {phase ===
      'exit'
        ? 'opacity-0 pointer-events-none'
        : 'opacity-100'}"
    >
      <div class="text-center">
        <div
          class="transition-all duration-700 ease-out {phase === 'enter'
            ? 'opacity-0 translate-y-3'
            : 'opacity-100 translate-y-0'}"
        >
          <p class="text-[11px] tracking-[0.3em] uppercase text-neutral-400 mb-3 font-mono">
            life is good
          </p>
          <h1 class="text-4xl md:text-5xl font-light tracking-tight text-neutral-900">
            活這真好
          </h1>
          <div class="mt-6 flex items-center justify-center gap-2">
            <div class="w-1 h-1 rounded-full bg-neutral-300"></div>
            <div class="w-1 h-1 rounded-full bg-neutral-300"></div>
            <div class="w-1 h-1 rounded-full bg-neutral-300"></div>
          </div>
        </div>
      </div>
    </div>
  {/if}

  <Navbar transparent />

  <main>
    <section class="pt-32 pb-20 md:pt-40 md:pb-28 px-6">
      <div class="max-w-6xl mx-auto">
        <div class="animate-fade-up">
          <p class="text-[11px] tracking-[0.3em] uppercase text-neutral-400 mb-4 font-mono">
            活這真好
          </p>
          <h2
            class="text-3xl md:text-5xl lg:text-6xl font-light tracking-tight leading-[1.1] text-neutral-900 max-w-2xl"
          >
            你需要的，
            <br />
            <span class="text-neutral-400">都在這裡。</span>
          </h2>
        </div>
        <div class="mt-10 flex items-center gap-4 animate-fade-up delay-200">
          <Link
            to="/bus"
            class="inline-flex items-center h-11 px-6 bg-neutral-900 text-white text-[13px] font-medium rounded-full hover:bg-neutral-800 transition-colors active:scale-[0.98]"
          >
            公車到了沒？
          </Link>
          <Link
            to="/trash"
            class="inline-flex items-center h-11 px-6 text-[13px] font-medium text-neutral-600 border border-neutral-200 rounded-full hover:border-neutral-300 hover:text-neutral-900 transition-colors active:scale-[0.98]"
          >
            我逝垃圾
          </Link>
        </div>
      </div>
    </section>

    <section class="px-6 pb-8">
      <div class="max-w-6xl mx-auto">
        <div class="h-px bg-neutral-100"></div>
      </div>
    </section>

    <section class="px-6 py-20 md:py-28">
      <div class="max-w-6xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-up delay-300">
          <Link
            to="/bus"
            class="group p-8 rounded-2xl border border-neutral-100 hover:border-neutral-200 hover:bg-neutral-50 transition-all"
          >
            <p class="text-[11px] tracking-[0.3em] uppercase text-neutral-400 mb-3 font-mono">
              公車到了沒？
            </p>
            <h3 class="text-xl font-light tracking-tight text-neutral-900 mb-2">雙北公車即時資訊</h3>
            <p class="text-[13px] text-neutral-400">臺北市 + 新北市，路線搜尋、即時到站、路線規劃</p>
          </Link>

          <Link
            to="/trash"
            class="group p-8 rounded-2xl border border-neutral-100 hover:border-neutral-200 hover:bg-neutral-50 transition-all"
          >
            <p class="text-[11px] tracking-[0.3em] uppercase text-neutral-400 mb-3 font-mono">
              我逝垃圾
            </p>
            <h3 class="text-xl font-light tracking-tight text-neutral-900 mb-2">垃圾車即時追蹤</h3>
            <p class="text-[13px] text-neutral-400">雙北＋台中垃圾車 GPS 追蹤、時刻表查詢、到站提醒</p>
          </Link>
        </div>
      </div>
    </section>

    <section class="px-6 py-20 md:py-28 bg-neutral-50">
      <div class="max-w-6xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-up">
          <div>
            <p class="text-2xl font-light text-neutral-900 tracking-tight">3</p>
            <p class="text-[12px] text-neutral-400 mt-1">即時追蹤城市</p>
          </div>
          <div>
            <p class="text-2xl font-light text-neutral-900 tracking-tight">50,000+</p>
            <p class="text-[12px] text-neutral-400 mt-1">公車站牌</p>
          </div>
          <div>
            <p class="text-2xl font-light text-neutral-900 tracking-tight">PWA</p>
            <p class="text-[12px] text-neutral-400 mt-1">推播到站提醒</p>
          </div>
        </div>
      </div>
    </section>
  </main>

  <footer class="px-6 py-12 border-t border-neutral-100">
    <div
      class="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
    >
      <div>
        <p class="text-[13px] text-neutral-900 font-medium">活這真好</p>
        <p class="text-[11px] text-neutral-400 mt-1">
          公車到了沒？ · 我逝垃圾
        </p>
      </div>
      <p class="text-[11px] text-neutral-400">
        資料來源：各縣市公開資料
      </p>
    </div>
  </footer>
</div>
