<script lang="ts">
  import Navbar from "@/components/Navbar.svelte";
  import RoutePlanner from "@/components/RoutePlanner.svelte";
</script>

<div class="min-h-screen bg-white">
  <Navbar />

  <main class="pt-14">
    <section class="px-6 py-16 md:py-20">
      <div class="max-w-6xl mx-auto">
        <div class="animate-fade-up">
          <p class="text-[11px] tracking-[0.3em] uppercase text-neutral-400 mb-4 font-mono">
            路線規劃
          </p>
          <h2 class="text-2xl md:text-3xl font-light tracking-tight text-neutral-900">
            A 到 B
          </h2>
        </div>
        <div class="mt-8 animate-fade-up delay-100">
          <RoutePlanner />
        </div>
      </div>
    </section>
  </main>
</div>
