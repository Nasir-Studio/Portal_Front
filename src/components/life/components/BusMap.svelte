<script lang="ts">
  import { onMount } from "svelte";
  import L from "leaflet";

  interface StopLocation {
    name: string;
    lat: number;
    lon: number;
    sid: string;
  }

  interface BusPosition {
    bus_id: string;
    route_id: string;
    route_name?: string;
    go_back: number;
    lat: number;
    lon: number;
    speed: number | null;
    azimuth: number | null;
    data_time: string;
    eta?: {
      eta_text: string;
      nearest_stop_name: string;
      dist_to_nearest_km: number;
    } | null;
  }

  function createStopIcon() {
    return L.divIcon({
      className: "",
      iconSize: [10, 10],
      iconAnchor: [5, 5],
      popupAnchor: [0, -8],
      html: `<div style="width:10px;height:10px;background:#111;border-radius:50%;border:2px solid #fff;box-shadow:0 1px 3px rgba(0,0,0,0.2);"></div>`,
    });
  }

  const STOP_ICON = createStopIcon();

  function createBusIcon(etaText?: string) {
    const badge = etaText
      ? `<div style="position:absolute;top:-8px;right:-8px;background:#111;color:#fff;font-size:9px;padding:1px 4px;border-radius:6px;white-space:nowrap;font-weight:600;box-shadow:0 1px 3px rgba(0,0,0,0.3);">${etaText}</div>`
      : "";
    return L.divIcon({
      className: "",
      iconSize: [20, 20],
      iconAnchor: [10, 10],
      popupAnchor: [0, -12],
      html: `<div style="position:relative;width:20px;height:20px;">
        ${badge}
        <div style="width:20px;height:20px;background:#2563eb;border-radius:50%;border:2px solid #fff;box-shadow:0 2px 6px rgba(37,99,235,0.5);display:flex;align-items:center;justify-content:center;">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="14" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/><circle cx="7" cy="21" r="1.5"/><circle cx="17" cy="21" r="1.5"/></svg>
        </div>
      </div>`,
    });
  }

  const BUS_ICON = createBusIcon();

  let stops = $state<StopLocation[]>([]);
  let busPositions = $state<BusPosition[]>([]);
  let loading = $state(true);
  let query = $state("");
  let city = $state<"taipei" | "taichung">("taipei");
  let refreshing = $state(false);

  let mapEl: HTMLDivElement | null = null;
  let map = $state<L.Map | null>(null);
  let tileLayer: L.TileLayer | null = null;
  const stopMarkers = new Map<string, L.Marker>();
  const busMarkers = new Map<string, L.Marker>();

  const center: [number, number] = $derived(
    city === "taichung" ? [24.15, 120.67] : [25.033, 121.565]
  );

  const filteredStops = $derived(
    !query ? [] : stops.filter((s) => s.name.includes(query)).slice(0, 50)
  );

  $effect(() => {
    if (city) {
      loading = true;
      query = "";
      busPositions = [];
      const url = city === "taichung" ? "/api/bus/stops?city=taichung" : "/data/stops.json";
      fetch(url)
        .then((r) => r.json())
        .then((data) => {
          const locations: StopLocation[] = [];
          for (const [name, info] of Object.entries(data.by_name as Record<string, string[]>)) {
            const sid = info[0];
            const stopInfo = data.by_sid[sid];
            if (stopInfo?.lat && stopInfo?.lon) {
              locations.push({
                name,
                lat: parseFloat(stopInfo.lat),
                lon: parseFloat(stopInfo.lon),
                sid,
              });
            }
          }
          stops = locations;
          loading = false;
        })
        .catch(() => (loading = false));
    }
  });

  $effect(() => {
    if (city !== "taipei") return;

    let cancelled = false;
    function pollPositions() {
      fetch("/api/bus/positions")
        .then((r) => r.json())
        .then((data) => {
          if (!cancelled && data.positions) {
            busPositions = data.positions;
          }
        })
        .catch(() => {});
    }

    pollPositions();
    const interval = setInterval(pollPositions, 120_000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  });

  function refreshPositions() {
    if (refreshing) return;
    refreshing = true;
    fetch("/api/bus/positions")
      .then((r) => r.json())
      .then((data) => {
        if (data.positions) busPositions = data.positions;
      })
      .catch(() => {})
      .finally(() => (refreshing = false));
  }

  function ensureMap() {
    if (map || !mapEl) return;
    map = L.map(mapEl, { zoomControl: false }).setView(center, 13);
    tileLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
    }).addTo(map);
  }

  onMount(() => {
    ensureMap();
    return () => {
      map?.remove();
      map = null;
    };
  });

  $effect(() => {
    ensureMap();
    if (!map) return;
    map.setView(center, 13, { animate: true });

    const fs = filteredStops;
    const seen = new Set<string>();
    for (const s of fs) {
      const key = `${s.sid}-${s.name}`;
      seen.add(key);
      if (!stopMarkers.has(key)) {
        const m = L.marker([s.lat, s.lon], { icon: STOP_ICON }).addTo(map);
        m.bindPopup(
          `<div class="p-1"><p class="text-[13px] font-medium text-neutral-900">${s.name}</p><a href="/bus/search?stop=${encodeURIComponent(
            s.name
          )}" class="text-[11px] text-neutral-500 underline">查看到站資訊</a></div>`
        );
        stopMarkers.set(key, m);
      }
    }
    for (const [key, m] of stopMarkers) {
      if (!seen.has(key)) {
        map.removeLayer(m);
        stopMarkers.delete(key);
      }
    }

    const bp = busPositions;
    const seenBuses = new Set<string>();
    if (city === "taipei") {
      for (const bus of bp) {
        const key = `bus-${bus.bus_id}`;
        seenBuses.add(key);
        const busIcon = bus.eta?.eta_text ? createBusIcon(bus.eta.eta_text) : BUS_ICON;
        if (!busMarkers.has(key)) {
          const m = L.marker([bus.lat, bus.lon], { icon: busIcon }).addTo(map);
          m.bindPopup(
            `<div class="p-1"><p class="text-[13px] font-medium text-neutral-900">${
              bus.route_name || bus.route_id
            }</p><p class="text-[11px] text-neutral-500">車號：${bus.bus_id}${
              bus.speed != null && bus.speed > 0 ? ` · ${bus.speed} km/h` : ""
            }</p>${
              bus.eta
                ? `<div class="mt-1 pt-1 border-t border-neutral-100"><p class="text-[11px] text-blue-600 font-medium">預估到站：${bus.eta.eta_text}</p><p class="text-[10px] text-neutral-400">最近站點：${bus.eta.nearest_stop_name}（${bus.eta.dist_to_nearest_km} km）</p></div>`
                : ""
            }</div>`
          );
          busMarkers.set(key, m);
        } else {
          busMarkers.get(key)!.setLatLng([bus.lat, bus.lon]).setIcon(busIcon);
        }
      }
    }
    for (const [key, m] of busMarkers) {
      if (!seenBuses.has(key)) {
        map.removeLayer(m);
        busMarkers.delete(key);
      }
    }
  });
</script>

<div class="w-full h-full relative">
  <div class="absolute top-4 left-4 right-4 z-[1000] space-y-2">
    <div class="flex gap-1 p-1 bg-white rounded-xl shadow-sm border border-neutral-100">
      <button
        onclick={() => city = "taipei"}
        class={`flex-1 h-8 text-[12px] rounded-lg transition-all ${
          city === "taipei" ? "bg-neutral-900 text-white font-medium" : "text-neutral-500"
        }`}
      >
        雙北
      </button>
      <button
        onclick={() => city = "taichung"
        }
        class={`flex-1 h-8 text-[12px] rounded-lg transition-all ${
          city === "taichung" ? "bg-neutral-900 text-white font-medium" : "text-neutral-500"
        }`}
      >
        台中
      </button>
      {#if city === "taipei" && busPositions.length > 0}
        <button
          onclick={refreshPositions}
          disabled={refreshing}
          class="h-8 w-8 flex items-center justify-center rounded-lg text-neutral-400 hover:text-neutral-700 transition-colors disabled:opacity-50"
        >
          <svg
            class={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
          </svg>
        </button>
      {/if}
    </div>
    <div class="panel px-3 py-2">
      <input
        type="text"
        bind:value={query}
        placeholder="搜尋站牌名稱..."
        class="w-full h-9 px-3 text-[13px] bg-transparent text-neutral-700 placeholder:text-neutral-300 focus:outline-none"
      />
    </div>
    {#if city === "taipei" && busPositions.length > 0}
      <div class="panel px-3 py-1.5 flex items-center gap-1.5">
        <div class="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
        <p class="text-[11px] text-neutral-500">
          即時追蹤 {busPositions.length} 輛公車
        </p>
      </div>
    {/if}
  </div>

  <div bind:this={mapEl} class="w-full h-full"></div>

  {#if loading}
    <div class="absolute inset-0 flex items-center justify-center bg-white z-[999]">
      <div class="text-center">
        <div class="w-5 h-5 border-2 border-neutral-200 border-t-neutral-600 rounded-full animate-spin mx-auto mb-3"></div>
        <p class="text-[12px] text-neutral-400">載入站牌中...</p>
      </div>
    </div>
  {/if}

  {#if !loading && filteredStops.length === 0 && !query}
    <div class="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000]">
      <div class="panel px-4 py-2">
        <p class="text-[11px] text-neutral-500">搜尋站牌名稱以顯示地圖標記</p>
      </div>
    </div>
  {/if}
</div>
