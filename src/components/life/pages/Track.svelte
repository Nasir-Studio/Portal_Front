<script lang="ts">
  import { onMount } from "svelte";
  import L from "leaflet";
  import { cities } from "@/lib/cities";
  import Navbar from "@/components/Navbar.svelte";
  import MapTracker from "@/components/MapTracker.svelte";
  import { getLocation, navigate } from "@/lib/router.svelte";

  const location = getLocation();

  const realtimeCities = cities.filter((c) => c.hasRealtime);

  const initialCity =
    new URLSearchParams(location.state.search).get("city") || "newtaipei";

  let selectedCity = $state(initialCity);
  let trucks = $state<any[]>([]);
  let loading = $state(true);
  let error = $state<string | null>(null);
  let lastUpdate = $state<Date | null>(null);

  async function fetchTrucks(city: string) {
    try {
      let dataLoaded = false;

      const file = city === "taichung" ? "/data/trucks_taichung.json" : "/data/trucks_fallback.json";
      try {
        const fallbackRes = await fetch(file);
        if (fallbackRes.ok) {
          const fallbackData = await fallbackRes.json();
          trucks = fallbackData;
          lastUpdate = new Date();
          error = null;
          dataLoaded = true;
        }
      } catch {}

      if (!dataLoaded) {
        try {
          const res = await fetch(`https://api.nsir.uk/life/trucks?city=${city}`);
          if (res.ok) {
            const data = await res.json();
            if (data.trucks && data.trucks.length > 0) {
              trucks = data.trucks;
              lastUpdate = new Date();
              error = null;
              dataLoaded = true;
            }
          }
        } catch {}
      }

      if (!dataLoaded) {
        error = "目前非收運時間或維護中";
      }
    } catch {
      error = null;
    } finally {
      loading = false;
    }
  }

  $effect(() => {
    const c = selectedCity;
    loading = true;
    error = null;
    fetchTrucks(c);
    const interval = setInterval(() => fetchTrucks(c), 600_000);
    return () => clearInterval(interval);
  });

  function handleCityChange(city: string) {
    selectedCity = city;
    navigate(`/track?city=${city}`);
  }

  function handleCityDetected(detectedCity: string) {
    if (detectedCity !== selectedCity) {
      selectedCity = detectedCity;
      navigate(`/track?city=${detectedCity}`);
    }
  }
</script>

<div class="h-screen flex flex-col bg-white">
  <Navbar>
    {#snippet children()}
      <select
        value={selectedCity}
        onchange={(e) => handleCityChange(e.currentTarget.value)}
        class="h-8 md:hidden text-[13px] px-3 py-1.5 rounded-lg border border-neutral-200 bg-white text-neutral-700 appearance-none cursor-pointer"
      >
        {#each realtimeCities as city (city.id)}
          <option value={city.id}>{city.name}</option>
        {/each}
      </select>
      <button
        onclick={() => fetchTrucks(selectedCity)}
        class="h-8 w-8 inline-flex items-center justify-center text-[12px] text-neutral-400 hover:text-neutral-700 transition-colors"
        title="重新整理"
      >
        ↻
      </button>
    {/snippet}
  </Navbar>

  <main class="flex-1 relative">
    <MapTracker trucks={trucks} city={selectedCity} onCityDetected={handleCityDetected} />

    {#if loading && trucks.length === 0}
      <div class="absolute top-16 left-1/2 -translate-x-1/2 z-[1000]">
        <div class="panel px-4 py-2.5 flex items-center gap-2">
          <div class="w-4 h-4 border-2 border-neutral-200 border-t-neutral-600 rounded-full animate-spin"></div>
          <p class="text-[12px] text-neutral-400">載入中...</p>
        </div>
      </div>
    {/if}

    {#if error && !loading}
      <div class="absolute bottom-20 left-1/2 -translate-x-1/2 z-[999]">
        <div class="panel px-4 py-2.5 flex items-center gap-3">
          <p class="text-[12px] text-neutral-600">{error}</p>
          <button
            onclick={() => {
              loading = true;
              fetchTrucks(selectedCity);
            }}
            class="text-[11px] font-medium text-neutral-900 underline underline-offset-2"
          >
            重試
          </button>
        </div>
      </div>
    {/if}

    {#if trucks.length === 0 && !loading && !error}
      <div class="absolute top-16 left-1/2 -translate-x-1/2 z-[1000]">
        <div class="panel px-4 py-2.5">
          <p class="text-[12px] text-neutral-600">目前沒有找到垃圾車</p>
          <p class="text-[11px] text-neutral-400">嘗試切換其他城市或等一下再查</p>
        </div>
      </div>
    {/if}

    <div class="absolute bottom-0 left-0 right-0 z-[998]">
      <div class="max-w-6xl mx-auto px-4 pb-4">
        <div class="panel px-4 py-2.5 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="flex items-center gap-1.5">
              <div class="w-1.5 h-1.5 rounded-full bg-green-500"></div>
              <span class="text-[11px] text-neutral-500">一般</span>
            </div>
            <div class="flex items-center gap-1.5">
              <div class="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
              <span class="text-[11px] text-neutral-500">資源回收</span>
            </div>
            <div class="flex items-center gap-1.5">
              <div class="w-1.5 h-1.5 rounded-full bg-red-500"></div>
              <span class="text-[11px] text-neutral-500">我的位置</span>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-[11px] text-neutral-400">
              {trucks.length} 輛
            </span>
            {#if lastUpdate}
              <span class="text-[10px] text-neutral-300 font-mono">
                {lastUpdate.toLocaleTimeString("zh-TW", { hour: "2-digit", minute: "2-digit" })}
              </span>
            {/if}
          </div>
        </div>
      </div>
    </div>
  </main>
</div>
