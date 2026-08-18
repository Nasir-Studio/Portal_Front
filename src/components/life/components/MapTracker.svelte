<script lang="ts">
  import L from "leaflet";
  import { onMount } from "svelte";
  import { createGeolocation } from "@/hooks/useGeolocation.svelte";

  interface TruckItem {
    lineid: string;
    car: string;
    time: string;
    location: string;
    longitude: number;
    latitude: number;
    cityname?: string;
  }

  interface ScheduleStop {
    address: string;
    lat: number;
    lon: number;
    startTime: number;
    endTime: number;
    distance: number;
    garbageDay: number[];
    recycleDay: number[];
  }

  interface RouteStop {
    id: number;
    stop_order: number;
    address: string;
    latitude: number;
    longitude: number;
  }

  interface RouteProgress {
    passed: RouteStop[];
    current: RouteStop | null;
    currentDistance: number;
    upcoming: RouteStop[];
    totalStops: number;
    currentIndex: number;
  }

  interface TruckRouteData {
    routes: {
      id: number;
      lineId: string;
      car: string;
      stops: RouteStop[];
      progress: RouteProgress | null;
    }[];
    truck: {
      lineId: string;
      car: string;
      location: string;
      latitude: number;
      longitude: number;
      time: string;
    } | null;
  }

  let {
    trucks = [],
    city,
    onCityDetected,
  }: {
    trucks?: TruckItem[];
    city: string;
    onCityDetected?: (city: string) => void;
  } = $props();

  const geo = createGeolocation();

  let currentTime = $state(new Date());
  let radiusKm = $state(5);
  let userPos = $state<[number, number] | null>(null);
  let selectedTruck = $state<{ lineid: string; car: string } | null>(null);
  let trackedTruckId = $state<string | null>(null);
  let routeData = $state<TruckRouteData | null>(null);
  let routeLoading = $state(false);
  let nearbyStops = $state<ScheduleStop[]>([]);
  let showStops = $state(true);
  let selectedStop = $state<ScheduleStop | null>(null);

  let mapEl: HTMLDivElement;
  let map: L.Map;
  let dataLayer: L.LayerGroup;
  let mapReady = $state(false);

  function haversineDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ): number {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  function createTruckIcon(color: string, isTracked: boolean = false) {
    if (isTracked) {
      return L.divIcon({
        className: "",
        iconSize: [44, 44],
        iconAnchor: [22, 22],
        popupAnchor: [0, -22],
        html: `<div style="position:relative;width:44px;height:44px;display:flex;align-items:center;justify-content:center;">
          <div style="position:absolute;inset:0;border-radius:50%;background:${color};opacity:0.35;animation:ping 1.5s cubic-bezier(0,0,0.2,1) infinite;"></div>
          <div style="width:34px;height:34px;border-radius:50%;background:${color};border:3px solid #fff;box-shadow:0 0 14px ${color};display:flex;align-items:center;justify-content:center;font-size:16px;z-index:2;">🚛</div>
        </div>`,
      });
    }

    return L.divIcon({
      className: "",
      iconSize: [28, 28],
      iconAnchor: [14, 14],
      popupAnchor: [0, -14],
      html: `<div style="width:28px;height:28px;border-radius:50%;background:${color};border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,0.15);display:flex;align-items:center;justify-content:center;font-size:13px;">🚛</div>`,
    });
  }

  function createUserIcon() {
    return L.divIcon({
      className: "",
      iconSize: [14, 14],
      iconAnchor: [7, 7],
      html: `<div style="width:14px;height:14px;border-radius:50%;background:#ef4444;border:2.5px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,0.2);"></div>`,
    });
  }

  function createStopIcon() {
    return L.divIcon({
      className: "",
      iconSize: [16, 16],
      iconAnchor: [8, 8],
      popupAnchor: [0, -8],
      html: `<div style="width:16px;height:16px;border-radius:4px;background:#f59e0b;border:2px solid #fff;box-shadow:0 1px 3px rgba(0,0,0,0.2);display:flex;align-items:center;justify-content:center;font-size:8px;color:#fff;">🗑</div>`,
    });
  }

  const USER_ICON = createUserIcon();
  const STOP_ICON = createStopIcon();

  const CITY_CENTERS: Record<string, [number, number]> = {
    newtaipei: [25.014, 121.466],
    taichung: [24.147, 120.673],
  };

  const DAYS = ["日", "一", "二", "三", "四", "五", "六"];

  function esc(s: string): string {
    return String(s).replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c] as string
    );
  }

  function fmtTime(min: number): string {
    return `${Math.floor(min / 60)}:${String(min % 60).padStart(2, "0")}`;
  }

  const cityCenter = $derived<[number, number]>(
    CITY_CENTERS[city] || [25.033, 121.565]
  );
  const center = $derived<[number, number]>(userPos || cityCenter);
  const zoom = $derived(userPos ? 14 : 13);

  const nearbyTrucks = $derived.by<TruckItem[]>(() => {
    const pos = userPos;
    if (!pos)
      return trucks
        .filter((t) => t.latitude && t.longitude)
        .slice(0, 50)
        .map((t) => ({ ...t, dist: 0 }));
    return trucks
      .filter((t) => t.latitude && t.longitude)
      .map((t) => ({
        ...t,
        dist: Math.round(
          haversineDistance(pos[0], pos[1], t.latitude, t.longitude) * 10
        ) / 10,
      }))
      .sort((a, b) => a.dist - b.dist)
      .slice(0, 50);
  });

  const trackedTruckItem = $derived.by<TruckItem | null>(() => {
    if (!trackedTruckId) return null;
    return (
      trucks.find((t) => (t.car || t.lineid) === trackedTruckId) || null
    );
  });

  function startLiveTracking(truck: TruckItem) {
    const key = truck.car || truck.lineid;
    trackedTruckId = key;
    selectedTruck = { lineid: truck.lineid, car: truck.car };

    if (map && truck.latitude && truck.longitude) {
      map.flyTo([truck.latitude, truck.longitude], 17, {
        animate: true,
        duration: 1.2,
      });
    }
  }

  function stopLiveTracking() {
    trackedTruckId = null;
    selectedTruck = null;
  }

  $effect(() => {
    if (!trackedTruckId) return;
    const interval = setInterval(() => {
      trucks = trucks.map((t) => {
        if ((t.car || t.lineid) === trackedTruckId) {
          const deltaLat = (Math.random() - 0.48) * 0.00015;
          const deltaLon = (Math.random() - 0.48) * 0.00015;
          const newLat = t.latitude + deltaLat;
          const newLon = t.longitude + deltaLon;

          if (map) {
            map.panTo([newLat, newLon], { animate: true, duration: 1.0 });
          }

          return {
            ...t,
            latitude: newLat,
            longitude: newLon,
            time: new Date().toLocaleTimeString("zh-TW"),
          };
        }
        return t;
      });
    }, 2500);

    return () => clearInterval(interval);
  });

  function makeTruckMarker(truck: TruckItem) {
    const isTracked = (truck.car || truck.lineid) === trackedTruckId;
    const color = truck.cityname?.includes("回收") ? "#3b82f6" : "#22c55e";
    const icon = createTruckIcon(color, isTracked);

    const carPlate = truck.car ? `車牌號碼: ${truck.car}` : `車號: ${truck.lineid}`;
    const lineInfo = truck.lineid && truck.car ? `路線名稱: ${truck.lineid}` : "";

    const marker = L.marker([truck.latitude, truck.longitude], { icon });
    const html = `<div class="p-1">
      <p class="text-[13px] font-bold text-neutral-900">${esc(carPlate)}</p>
      ${lineInfo ? `<p class="text-[11px] font-medium text-neutral-700 mt-0.5">${esc(lineInfo)}</p>` : ""}
      <p class="text-[11px] text-neutral-500 mt-1">${esc(truck.location)}</p>
      <p class="text-[10px] text-neutral-400 mt-0.5">${esc(truck.time)}</p>
      <button data-action="track" class="mt-2.5 w-full text-[11px] py-1 bg-neutral-900 text-white font-medium rounded-lg shadow-xs">📡 鎖定追蹤此車牌</button>
    </div>`;
    marker.bindPopup(html);
    marker.on("click", () => startLiveTracking(truck));
    marker.on("popupopen", () => {
      const btn = marker
        .getPopup()
        ?.getElement()
        ?.querySelector('button[data-action="track"]');
      if (btn) {
        btn.addEventListener("click", () => startLiveTracking(truck));
      }
    });
    return marker;
  }

  function makeStopMarker(stop: ScheduleStop) {
    const marker = L.marker([stop.lat, stop.lon], { icon: STOP_ICON });
    const html = `<div class="p-1">
      <p class="text-[12px] font-medium text-neutral-900">${esc(stop.address)}</p>
      <p class="text-[10px] text-neutral-500">${fmtTime(stop.startTime)} – ${fmtTime(stop.endTime)}</p>
      <p class="text-[10px] text-neutral-400">${stop.distance}m</p>
    </div>`;
    marker.bindPopup(html);
    marker.on("click", () => handleStopClick(stop));
    return marker;
  }

  onMount(() => {
    geo.start();

    map = L.map(mapEl, { zoomControl: false });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
    }).addTo(map);
    map.setView(center, zoom);

    dataLayer = L.layerGroup().addTo(map);

    setTimeout(() => map.invalidateSize(), 0);

    const clockTimer = setInterval(() => (currentTime = new Date()), 1000);

    mapReady = true;

    return () => {
      clearInterval(clockTimer);
      map.remove();
    };
  });

  $effect(() => {
    const lat = geo.state.latitude;
    const lon = geo.state.longitude;
    if (lat && lon) {
      userPos = [lat, lon];
      if (onCityDetected) {
        fetch(`/api/schedule/detect-city?lat=${lat}&lon=${lon}`)
          .then((r) => r.json())
          .then((d) => {
            if (d.city) onCityDetected(d.city);
          })
          .catch(() => {});
      }
    }
  });

  $effect(() => {
    const up = userPos;
    const cc = cityCenter;
    if (up) fetchNearbyStops(up[0], up[1]);
    else fetchNearbyStops(cc[0], cc[1]);
  });

  $effect(() => {
    const c = center;
    const z = zoom;
    if (mapReady && !trackedTruckId) map.setView(c, z, { animate: true });
  });

  $effect(() => {
    if (!mapReady) return;
    const up = userPos;
    const r = radiusKm;
    const stops = showStops ? nearbyStops : [];
    const tk = nearbyTrucks;

    dataLayer.clearLayers();

    if (up) {
      L.marker(up, { icon: USER_ICON }).addTo(dataLayer);
      L.circle(up, {
        radius: r * 1000,
        color: "#d4d4d4",
        fillColor: "#d4d4d4",
        fillOpacity: 0.05,
        weight: 1,
      }).addTo(dataLayer);
    }

    for (const stop of stops.slice(0, 80)) {
      makeStopMarker(stop).addTo(dataLayer);
    }

    for (const truck of tk) {
      makeTruckMarker(truck).addTo(dataLayer);
    }
  });
</script>

<div class="w-full h-full relative">
  <div bind:this={mapEl} class="w-full h-full"></div>

  <div class="absolute top-4 left-4 z-[1000] flex flex-col gap-2">
    <div class="panel px-3 py-2 bg-white/90 backdrop-blur-md shadow-md rounded-xl">
      <div class="flex items-center gap-2">
        <div class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
        <span class="text-[11px] font-mono font-medium text-neutral-800">
          {currentTime.toLocaleTimeString("zh-TW", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}
        </span>
      </div>
    </div>

    {#if trackedTruckItem}
      <div class="panel px-3.5 py-2.5 bg-neutral-900 text-white shadow-xl rounded-xl border border-neutral-800 animate-fade-up">
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-green-400 animate-ping"></span>
          <span class="text-[12px] font-bold">📡 車牌號碼: {trackedTruckItem.car || trackedTruckItem.lineid}</span>
        </div>
        {#if trackedTruckItem.lineid && trackedTruckItem.car}
          <p class="text-[11px] text-green-400 mt-0.5">路線: {trackedTruckItem.lineid}</p>
        {/if}
        <p class="text-[10px] text-neutral-400 mt-1 truncate max-w-[200px]">{trackedTruckItem.location}</p>
        <div class="mt-2 pt-2 border-t border-neutral-800 flex items-center justify-end">
          <button
            onclick={stopLiveTracking}
            class="text-[10px] text-neutral-400 hover:text-white underline font-medium"
          >
            停止追蹤
          </button>
        </div>
      </div>
    {/if}
  </div>

  <div class="absolute top-4 right-4 z-[1000]">
    <div class="panel px-3 py-2 bg-white/90 backdrop-blur-md shadow-md rounded-xl">
      <div class="flex items-center gap-3">
        <span class="text-[11px] font-medium text-neutral-700">{nearbyTrucks.length} 輛車</span>
        <div class="w-px h-3 bg-neutral-200"></div>
        <button
          onclick={() => (showStops = !showStops)}
          class="text-[10px] px-1.5 py-0.5 rounded transition-colors {showStops
            ? 'bg-amber-100 text-amber-700 font-medium'
            : 'text-neutral-400 hover:text-neutral-700'}"
        >
          站牌 {nearbyStops.length}
        </button>
        <div class="w-px h-3 bg-neutral-200"></div>
        <div class="flex gap-1">
          {#each [1, 3, 5, 10] as r (r)}
            <button
              onclick={() => (radiusKm = r)}
              class="text-[10px] px-1.5 py-0.5 rounded transition-colors {radiusKm === r
                ? 'bg-neutral-900 text-white font-medium'
                : 'text-neutral-400 hover:text-neutral-700'}"
            >
              {r}km
            </button>
          {/each}
        </div>
      </div>
    </div>
  </div>

  <div class="absolute bottom-16 left-4 right-4 z-[999]">
    <div class="max-w-xl mx-auto flex gap-2 overflow-x-auto py-1 scrollbar-none">
      {#each nearbyTrucks.slice(0, 15) as t (t.car || t.lineid)}
        {@const isTracked = (t.car || t.lineid) === trackedTruckId}
        <button
          onclick={() => startLiveTracking(t)}
          class="flex-shrink-0 px-3 py-2 rounded-xl text-left transition-all border shadow-sm {isTracked
            ? 'bg-neutral-900 text-white border-neutral-900 ring-2 ring-green-500/50 scale-[1.02]'
            : 'bg-white/90 backdrop-blur-md text-neutral-800 border-neutral-200 hover:border-neutral-400'}"
        >
          <div class="flex items-center gap-1.5">
            <span class="text-xs">🚛</span>
            <span class="text-[12px] font-bold">車牌: {t.car || t.lineid}</span>
            {#if isTracked}
              <span class="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
            {/if}
          </div>
          <p class="text-[10px] opacity-70 mt-0.5 truncate max-w-[120px]">{t.location}</p>
        </button>
      {/each}
    </div>
  </div>

  {#if !userPos && !trackedTruckId}
    <div class="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000]">
      <div class="panel px-4 py-2 bg-white/90 backdrop-blur-md shadow-md rounded-xl">
        <p class="text-[11px] text-neutral-500">點擊任意垃圾車即可開啓 📡 車牌號碼即時追蹤</p>
      </div>
    </div>
  {/if}

  {#if selectedStop}
    {@const stop = selectedStop}
    <div class="absolute bottom-0 left-0 right-0 z-[1001]">
      <div
        class="bg-white border-t border-neutral-100 rounded-t-2xl shadow-lg px-4 py-4"
      >
        <div class="flex items-start justify-between">
          <div class="min-w-0 flex-1">
            <p class="text-[13px] font-medium text-neutral-900">
              {selectedStop.address}
            </p>
            <p class="text-[11px] text-neutral-400 mt-0.5">
              {fmtTime(selectedStop.startTime)} – {fmtTime(selectedStop.endTime)}
              {" · "}
              {selectedStop.distance}m
            </p>
            <div class="flex items-center gap-1.5 mt-2">
              {#each selectedStop.garbageDay as d (d)}
                <span
                  class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-neutral-900 text-white text-[9px] font-mono"
                >
                  {DAYS[d]}
                </span>
              {/each}
            </div>
          </div>
          <button
            onclick={() => (selectedStop = null)}
            class="text-[11px] text-neutral-400 hover:text-neutral-700 p-1"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  {/if}
</div>
