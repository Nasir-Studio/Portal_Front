<script lang="ts">
  import Link from "@/components/Link.svelte";
  import Navbar from "@/components/Navbar.svelte";
</script>

<div class="min-h-screen bg-white">
  <Navbar />

  <main class="pt-14">
    <section class="pt-32 pb-20 md:pt-40 md:pb-28 px-6">
      <div class="max-w-6xl mx-auto">
        <div class="animate-fade-up">
          <p class="text-[11px] tracking-[0.3em] uppercase text-neutral-400 mb-4 font-mono">
            雙北＋台中垃圾車資訊
          </p>
          <h2
            class="text-3xl md:text-5xl lg:text-6xl font-light tracking-tight leading-[1.1] text-neutral-900 max-w-2xl"
          >
            垃圾來了，
            <br />
            <span class="text-neutral-400">你要怎麼查。</span>
          </h2>
        </div>
        <div class="mt-10 flex items-center gap-4 animate-fade-up delay-200">
          <Link
            to="/schedule"
            class="inline-flex items-center h-11 px-6 bg-neutral-900 text-white text-[13px] font-medium rounded-full hover:bg-neutral-800 transition-colors active:scale-[0.98]"
          >
            時刻表查詢
          </Link>
          <Link
            to="/track"
            class="inline-flex items-center h-11 px-6 text-[13px] font-medium text-neutral-600 border border-neutral-200 rounded-full hover:border-neutral-300 hover:text-neutral-900 transition-colors active:scale-[0.98]"
          >
            定位追蹤
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
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-up">
          <div>
            <p class="text-2xl font-light text-neutral-900 tracking-tight">3</p>
            <p class="text-[12px] text-neutral-400 mt-1">即時追蹤城市</p>
          </div>
          <div>
            <p class="text-2xl font-light text-neutral-900 tracking-tight">時刻表</p>
            <p class="text-[12px] text-neutral-400 mt-1">地址搜尋、星期篩選</p>
          </div>
          <div>
            <p class="text-2xl font-light text-neutral-900 tracking-tight">PWA</p>
            <p class="text-[12px] text-neutral-400 mt-1">推播到站提醒</p>
          </div>
        </div>
      </div>
    </section>
  </main>
</div>
