<script lang="ts">
  import { onMount } from "svelte";

  interface BusPlanResult {
    routeName: string;
    rid: string;
    arrivalTimeText: string;
    rawTime: number;
    directionText: string;
    stopCount: number;
    estimatedDuration: number;
    pathStops: Array<{ name: string; sid: string; geo?: { lat: number; lon: number } }>;
  }

  interface Favorite {
    start: string;
    end: string;
  }

  const STORAGE_KEY = "bus-favorites";

  let startStop = $state("");
  let endStop = $state("");
  let startQuery = $state("");
  let endQuery = $state("");
  let allStops = $state<string[]>([]);
  let buses = $state<BusPlanResult[]>([]);
  let loading = $state(false);
  let error = $state("");
  let favorites = $state<Favorite[]>([]);
  let showStartDropdown = $state(false);
  let showEndDropdown = $state(false);

  onMount(() => {
    fetch("/data/stops_index.json")
      .then((r) => r.json())
      .then((data: any) => (allStops = Array.isArray(data) ? data : Object.keys(data.by_name || {})));

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) favorites = JSON.parse(stored);
    } catch {}
  });

  function filterStops(q: string) {
    return q ? allStops.filter((n) => n.includes(q)).slice(0, 6) : [];
  }

  async function handlePlan() {
    if (!startStop || !endStop) {
      error = "請選擇起點和終點";
      return;
    }
    loading = true;
    error = "";
    buses = [];
    try {
      const res = await fetch(
        `/api/bus/plan?start=${encodeURIComponent(startStop)}&end=${encodeURIComponent(endStop)}`
      );
      const data = await res.json();
      if (data.error) error = data.error;
      else buses = data.buses || [];
    } catch {
      error = "搜尋失敗";
    } finally {
      loading = false;
    }
  }

  function saveFavorite() {
    if (!startStop || !endStop) return;
    const updated = [...favorites];
    if (!updated.some((f) => f.start === startStop && f.end === endStop)) {
      updated.push({ start: startStop, end: endStop });
      favorites = updated;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
  }

  function removeFavorite(index: number) {
    const updated = favorites.filter((_, i) => i !== index);
    favorites = updated;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }
</script>

<div class="w-full max-w-lg mx-auto">
  {#if favorites.length > 0}
    <div class="mb-6">
      <p class="text-[12px] text-neutral-400 mb-2">常用路線</p>
      <div class="flex flex-wrap gap-2">
        {#each favorites as fav, i (i)}
          <div class="flex items-center gap-1">
            <button
              onclick={() => {
                startStop = fav.start;
                startQuery = fav.start;
                endStop = fav.end;
                endQuery = fav.end;
              }}
              class="text-[12px] px-3 py-1.5 rounded-full border border-neutral-200 text-neutral-600 hover:border-neutral-300 hover:text-neutral-900 transition-colors"
            >
              {fav.start} → {fav.end}
            </button>
            <button
              onclick={() => removeFavorite(i)}
              class="text-[11px] text-neutral-300 hover:text-neutral-600"
            >
              ×
            </button>
          </div>
        {/each}
      </div>
    </div>
  {/if}

  <div class="space-y-4">
    <div>
      <label class="text-[12px] text-neutral-400 mb-1 block">起點</label>
      <div class="relative">
        <input
          type="text"
          bind:value={startQuery}
          oninput={(e) => {
            startQuery = (e.target as HTMLInputElement).value;
            startStop = "";
            showStartDropdown = true;
          }}
          onfocus={() => (showStartDropdown = true)}
          onblur={() => setTimeout(() => (showStartDropdown = false), 200)}
          placeholder="搜尋站牌名稱..."
          class="w-full h-11 px-4 text-[13px] rounded-xl border border-neutral-200 bg-white text-neutral-700 placeholder:text-neutral-300 focus:outline-none focus:border-neutral-400 transition-colors"
        />
        {#if showStartDropdown && !startStop && filterStops(startQuery).length > 0}
          <div class="absolute top-full left-0 right-0 mt-1 bg-white border border-neutral-100 rounded-xl shadow-lg z-10 overflow-hidden">
            {#each filterStops(startQuery) as name (name)}
              <button
                onmousedown={() => {
                  startStop = name;
                  startQuery = name;
                  showStartDropdown = false;
                }}
                class="w-full text-left px-4 py-2.5 text-[13px] text-neutral-700 hover:bg-neutral-50 transition-colors"
              >
                {name}
              </button>
            {/each}
          </div>
        {/if}
      </div>
    </div>

    <div>
      <label class="text-[12px] text-neutral-400 mb-1 block">終點</label>
      <div class="relative">
        <input
          type="text"
          bind:value={endQuery}
          oninput={(e) => {
            endQuery = (e.target as HTMLInputElement).value;
            endStop = "";
            showEndDropdown = true;
          }}
          onfocus={() => (showEndDropdown = true)}
          onblur={() => setTimeout(() => (showEndDropdown = false), 200)}
          placeholder="搜尋站牌名稱..."
          class="w-full h-11 px-4 text-[13px] rounded-xl border border-neutral-200 bg-white text-neutral-700 placeholder:text-neutral-300 focus:outline-none focus:border-neutral-400 transition-colors"
        />
        {#if showEndDropdown && !endStop && filterStops(endQuery).length > 0}
          <div class="absolute top-full left-0 right-0 mt-1 bg-white border border-neutral-100 rounded-xl shadow-lg z-10 overflow-hidden">
            {#each filterStops(endQuery) as name (name)}
              <button
                onmousedown={() => {
                  endStop = name;
                  endQuery = name;
                  showEndDropdown = false;
                }}
                class="w-full text-left px-4 py-2.5 text-[13px] text-neutral-700 hover:bg-neutral-50 transition-colors"
              >
                {name}
              </button>
            {/each}
          </div>
        {/if}
      </div>
    </div>

    <div class="flex gap-2">
      <button
        onclick={handlePlan}
        disabled={loading || !startStop || !endStop}
        class="flex-1 h-11 bg-neutral-900 text-white text-[13px] font-medium rounded-xl hover:bg-neutral-800 transition-colors disabled:opacity-40 active:scale-[0.98]"
      >
        {loading ? "搜尋中..." : "查詢路線"}
      </button>
      {#if startStop && endStop}
        <button
          onclick={saveFavorite}
          class="h-11 px-4 text-[13px] text-neutral-500 border border-neutral-200 rounded-xl hover:border-neutral-300 hover:text-neutral-900 transition-colors"
        >
          收藏
        </button>
      {/if}
    </div>
  </div>

  {#if error}
    <div class="mt-4 text-center">
      <p class="text-sm text-neutral-500">{error}</p>
    </div>
  {/if}

  {#if buses.length > 0}
    <div class="mt-6 space-y-3">
      <p class="text-[12px] text-neutral-400">可搭乘路線</p>
      {#each buses as bus, i (`${bus.rid}_${i}`)}
        <div
          class="p-4 rounded-xl border border-neutral-100 hover:border-neutral-200 transition-colors"
        >
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-neutral-900">{bus.routeName}</span>
            <span
              class={`text-[12px] font-medium ${
                bus.rawTime <= 0 ? "text-green-600" : "text-neutral-500"
              }`}
            >
              {bus.arrivalTimeText}
            </span>
          </div>
          <div class="flex items-center gap-3 text-[11px] text-neutral-400">
            <span>{bus.directionText}</span>
            <span>{bus.stopCount} 站</span>
            <span>約 {bus.estimatedDuration} 分</span>
          </div>
          {#if bus.pathStops.length > 0}
            <div class="mt-2 flex flex-wrap gap-1">
              {#each bus.pathStops.slice(0, 5) as s (s.sid)}
                <span class="text-[10px] text-neutral-300">
                  {s.name}
                </span>
              {/each}
              {#if bus.pathStops.length > 5}
                <span class="text-[10px] text-neutral-300">...{bus.pathStops.length} 站</span>
              {/if}
            </div>
          {/if}
        </div>
      {/each}
    </div>
  {/if}

  {#if !loading && !error && buses.length === 0 && startStop && endStop}
    <div class="mt-8 text-center">
      <p class="text-sm text-neutral-400">找不到直達路線</p>
    </div>
  {/if}
</div>
