<script lang="ts">
  import Navbar from "@/components/Navbar.svelte";
  import BusSearch from "@/components/BusSearch.svelte";
</script>

<div class="min-h-screen bg-white">
  <Navbar />

  <main class="pt-14">
    <section class="px-6 py-16 md:py-20">
      <div class="max-w-6xl mx-auto">
        <div class="animate-fade-up">
          <p class="text-[11px] tracking-[0.3em] uppercase text-neutral-400 mb-4 font-mono">
            路線搜尋
          </p>
          <h2 class="text-2xl md:text-3xl font-light tracking-tight text-neutral-900">
            雙北＋台中公車
          </h2>
        </div>
        <div class="mt-8 animate-fade-up delay-100">
          <BusSearch />
        </div>
      </div>
    </section>
  </main>
</div>
