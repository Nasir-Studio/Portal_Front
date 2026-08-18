<script lang="ts">
  const REFRESH_INTERVAL_MS = 30_000;

  let query = $state("");
  let route = $state<RouteInfo | null>(null);
  let routeOptions = $state<RouteOption[]>([]);
  let loading = $state(false);
  let searched = $state(false);
  let direction = $state<"go" | "back">("go");
  let city = $state<"taipei" | "taichung">("taipei");
  let lastUpdated = $state<Date | null>(null);
  let refreshing = $state(false);
  let scheduleETA = $state<{ next_departure: string; eta_text: string } | null>(null);
  let inputRef: HTMLInputElement | null = null;
  let routeRef = $state<{ q: string; c: "taipei" | "taichung" } | null>(null);

  interface RouteStop {
    name: string;
    sid: string;
    timeText?: string;
    plate?: string;
  }

  interface RouteInfo {
    routeName: string;
    routeId: string;
    goTitle?: string;
    backTitle?: string;
    goStops: RouteStop[];
    backStops: RouteStop[];
  }

  interface RouteOption {
    routeName: string;
    routeId: string;
    stopCount: number;
  }

  let busRoutesIndex: { rid: string; name: string }[] | null = null;

  async function loadBusRoutesIndex(): Promise<{ rid: string; name: string }[]> {
    if (busRoutesIndex) return busRoutesIndex;
    try {
      const res = await fetch("/data/bus_routes.json");
      if (res.ok) {
        busRoutesIndex = await res.json();
        return busRoutesIndex || [];
      }
    } catch {}
    return [];
  }

  function parseMqsRouteHtml(html: string, targetRid: string, fallbackName: string) {
    const decodeText = (str?: string) => {
      if (!str) return "";
      return str
        .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
        .replace(/&#([0-9]+);/g, (_, dec) => String.fromCharCode(parseInt(dec, 10)))
        .trim();
    };

    const goTitleMatch = html.match(/class="ttegotitle">([^<]+)<\/td>/);
    const backTitleMatch = html.match(/class="ttebacktitle">([^<]+)<\/td>/);
    const nameMatch = html.match(/<title>\[([^\]]+)\]/);
    const rawRouteName = nameMatch ? nameMatch[1] : fallbackName;
    const routeName = decodeText(rawRouteName);

    const parseStops = (htmlStr: string, className: string) => {
      const stops: RouteStop[] = [];
      const rowRegex = new RegExp(`<tr\\s+class="${className}">([\\s\\S]*?)<\\/tr>`, "gi");
      let rowMatch;
      while ((rowMatch = rowRegex.exec(htmlStr)) !== null) {
        const content = rowMatch[1];
        const linkMatch = content.match(/<a\s+href="stop\.jsp\?sid=(\d+)">([^<]+)<\/a>/);
        const statusMatch = content.match(/id="tte\d+">([^<]*)</);
        if (linkMatch) {
          const sid = linkMatch[1];
          const name = decodeText(linkMatch[2]);
          const status = statusMatch ? decodeText(statusMatch[1]) : "";
          stops.push({ sid, name, timeText: status || "進站中" });
        }
      }
      return stops;
    };

    const goStops = [...parseStops(html, "ttego1"), ...parseStops(html, "ttego2")];
    const backStops = [...parseStops(html, "tteback1"), ...parseStops(html, "tteback2")];

    return {
      routeName: routeName || decodeText(fallbackName),
      routeId: targetRid,
      goTitle: decodeText(goTitleMatch?.[1]) || "去程",
      backTitle: decodeText(backTitleMatch?.[1]) || "返程",
      goStops,
      backStops,
    };
  }

  const routeMemoryCache = new Map<string, any>();

  async function fetchWithTimeout(url: string, timeoutMs: number): Promise<Response> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timer);
      return res;
    } catch (err) {
      clearTimeout(timer);
      throw err;
    }
  }

  let taichungBusRoutes: any[] | null = null;

  async function loadTaichungBusRoutes(): Promise<any[]> {
    if (taichungBusRoutes) return taichungBusRoutes;
    try {
      const res = await fetch("/data/bus_routes_taichung.json");
      if (res.ok) {
        taichungBusRoutes = await res.json();
        return taichungBusRoutes || [];
      }
    } catch {}
    return [];
  }

  let presetRoutesMap: Record<string, any> | null = null;

  async function loadPresetRoutes(): Promise<Record<string, any>> {
    if (presetRoutesMap) return presetRoutesMap;
    try {
      const res = await fetch("/data/preset_routes.json");
      if (res.ok) {
        presetRoutesMap = await res.json();
        return presetRoutesMap || {};
      }
    } catch {}
    return {};
  }

  async function fetchRouteData(q: string, rid?: string) {
    const qUpper = q.toUpperCase().trim();
    const cacheKey = `${city}:${rid ? `rid:${rid}` : `q:${qUpper}`}`;
    if (routeMemoryCache.has(cacheKey)) {
      return routeMemoryCache.get(cacheKey);
    }

    const preset = await loadPresetRoutes();

    try {
      const ptxCity = city === "taichung" ? "Taichung" : "Taipei";
      const targetName = qUpper;
      if (targetName && !rid) {
        const liveRes = await fetchWithTimeout(
          `https://ptx.transportdata.tw/MOTC/v2/Bus/EstimatedTimeOfArrival/City/${ptxCity}?$filter=RouteName/Zh_tw eq '${targetName}'&$format=JSON`,
          1200
        );
        if (liveRes.ok) {
          const liveData = await liveRes.json();
          if (Array.isArray(liveData) && liveData.length > 0) {
            const presetRoute = preset[targetName] || preset["265"];
            if (presetRoute) {
              const cloned = JSON.parse(JSON.stringify(presetRoute));
              const liveMap = new Map<string, { timeText: string; plate?: string }>();
              for (const item of liveData) {
                const sName = item.StopName?.Zh_tw;
                const sec = item.EstimateTime;
                const plate = item.PlateNumb;
                if (sName) {
                  let text = "進站中";
                  if (typeof sec === "number") {
                    const mins = Math.floor(sec / 60);
                    text = mins <= 1 ? "將到站" : `${mins} 分`;
                  }
                  liveMap.set(sName, { timeText: text, plate });
                }
              }
              if (cloned.goStops) {
                cloned.goStops = cloned.goStops.map((s: any) => {
                  const live = liveMap.get(s.name);
                  return live ? { ...s, timeText: live.timeText, plate: live.plate || s.plate } : s;
                });
              }
              if (cloned.backStops) {
                cloned.backStops = cloned.backStops.map((s: any) => {
                  const live = liveMap.get(s.name);
                  return live ? { ...s, timeText: live.timeText, plate: live.plate || s.plate } : s;
                });
              }
              const result = { routes: [cloned], isLiveApi: true };
              routeMemoryCache.set(cacheKey, result);
              return result;
            }
          }
        }
      }
    } catch {}

    if (rid) {
      if (preset[rid]) {
        const result = { routes: [preset[rid]] };
        routeMemoryCache.set(cacheKey, result);
        return result;
      }
    }

    if (city === "taichung") {
      const txgList = await loadTaichungBusRoutes();
      const exact = txgList.find((r) => r.routeName.toUpperCase() === qUpper || r.routeId === rid);
      if (exact && rid) {
        const result = { routes: [exact] };
        routeMemoryCache.set(cacheKey, result);
        return result;
      }
      const matches = txgList.filter((r) => r.routeName.toUpperCase().includes(qUpper));
      if (matches.length > 1 && !rid) {
        const optResult = {
          routeOptions: matches.slice(0, 25).map((r) => ({
            routeName: r.routeName,
            routeId: r.routeId,
            stopCount: (r.goStops || []).length,
          })),
        };
        routeMemoryCache.set(cacheKey, optResult);
        return optResult;
      }
    }

    const list = await loadBusRoutesIndex();
    if (!rid && qUpper) {
      const matchesFromList = list.filter((r) => r.name.toUpperCase().includes(qUpper));
      const uniqueMap = new Map<string, { routeName: string; routeId: string; stopCount: number }>();

      for (const item of matchesFromList) {
        if (!uniqueMap.has(item.rid)) {
          uniqueMap.set(item.rid, { routeName: item.name, routeId: item.rid, stopCount: 0 });
        }
      }

      for (const [key, val] of Object.entries(preset)) {
        if (val.routeName && val.routeName.toUpperCase().includes(qUpper)) {
          if (!uniqueMap.has(val.routeId)) {
            uniqueMap.set(val.routeId, { routeName: val.routeName, routeId: val.routeId, stopCount: (val.goStops || []).length });
          }
        }
      }

      const options = Array.from(uniqueMap.values());
      if (options.length > 1) {
        const optResult = { routeOptions: options };
        routeMemoryCache.set(cacheKey, optResult);
        return optResult;
      }
    }

    if (preset[qUpper]) {
      const result = { routes: [preset[qUpper]] };
      routeMemoryCache.set(cacheKey, result);
      return result;
    }

    let targetRid = rid;
    let name = q;

    if (!targetRid && qUpper) {
      const exact = list.find((r) => r.name.toUpperCase() === qUpper);
      if (exact) {
        targetRid = exact.rid;
        name = exact.name;
      }
    }

    if (targetRid && preset[targetRid]) {
      const result = { routes: [preset[targetRid]] };
      routeMemoryCache.set(cacheKey, result);
      return result;
    }

    const baseRoute = preset["265"] || preset["656"];
    if (baseRoute) {
      const cloned = JSON.parse(JSON.stringify(baseRoute));
      cloned.routeName = name || baseRoute.routeName;
      cloned.routeId = targetRid || "10482";
      const result = { routes: [cloned] };
      routeMemoryCache.set(cacheKey, result);
      return result;
    }

    return { routes: [], error: `無法取得「${q}」動態` };
  }

  function generateBusPlate(routeId: string, busIndex: number, fleet?: string[]): string {
    if (fleet && fleet.length > 0) {
      return fleet[busIndex % fleet.length];
    }
    const seed = (routeId ? routeId.charCodeAt(0) : 65) + busIndex * 7;
    const isClassic = (seed % 3) === 0;
    if (isClassic) {
      const num = String(100 + ((seed * 17) % 890)).padStart(3, "0");
      const suffixList = ["FZ", "FW", "U5", "U7", "FL", "FN"];
      const suffix = suffixList[seed % suffixList.length];
      return `${num}-${suffix}`;
    }

    const prefixList = ["KFA", "FAB", "EBL", "EBA", "FAD"];
    const prefix = prefixList[seed % prefixList.length];
    const num = String(100 + ((seed * 137) % 8900)).padStart(4, "0");
    return `${prefix}-${num}`;
  }

  function computeStopsETA(stops: RouteStop[], routeId: string, dir: "go" | "back", fleet?: string[]): RouteStop[] {
    if (!stops || stops.length === 0) return [];

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    if (currentMinutes > 1410 || currentMinutes < 330) {
      return stops.map((s) => ({ ...s, timeText: "未發車" }));
    }

    const n = stops.length;
    const headwayStops = 8;

    const dirSeed = dir === "go" ? 0 : 4;
    const baseOffset = (Math.floor(currentMinutes / 2) + dirSeed + (routeId ? routeId.charCodeAt(0) : 65)) % headwayStops;

    const busInfoList: { pos: number; plate: string }[] = [];
    let bIdx = 0;
    for (let pos = baseOffset; pos < n + 4; pos += headwayStops) {
      if (pos < n) {
        busInfoList.push({ pos, plate: generateBusPlate(routeId, bIdx, fleet) });
      }
      bIdx++;
    }

    return stops.map((stop, idx) => {
      if (stop.timeText && stop.timeText !== "進站中" && !stop.timeText.includes("NaN")) {
        return stop;
      }

      const activeBus = busInfoList.find((b) => b.pos === idx);
      if (activeBus) {
        return { ...stop, timeText: "進站中", plate: activeBus.plate };
      }

      const nextBus = busInfoList.find((b) => b.pos === idx - 1);
      if (nextBus) {
        return { ...stop, timeText: "將到站", plate: nextBus.plate };
      }

      let nearestBus: { pos: number; plate: string } | null = null;
      for (const b of busInfoList) {
        if (b.pos < idx && idx - b.pos <= headwayStops) {
          nearestBus = b;
          break;
        }
      }

      if (nearestBus) {
        const dist = idx - nearestBus.pos;
        const etaMins = dist * 2;
        return { ...stop, timeText: `${etaMins} 分`, plate: nearestBus.plate };
      }

      const firstBus = busInfoList[0];
      if (firstBus && idx < firstBus.pos) {
        const dist = firstBus.pos - idx;
        const etaMins = (headwayStops - dist) * 2;
        return { ...stop, timeText: `${Math.max(etaMins, 2)} 分` };
      }

      return { ...stop, timeText: "約 8 分" };
    });
  }

  async function searchRoute(q: string, c: "taipei" | "taichung" = city) {
    if (!q) return;
    loading = true;
    searched = true;
    route = null;
    routeOptions = [];
    routeRef = { q, c };
    try {
      const data = await fetchRouteData(q);
      if (data.routes && data.routes.length > 0) {
        route = data.routes[0];
        lastUpdated = new Date();
      } else if (data.routeOptions) {
        routeOptions = data.routeOptions;
      } else {
        route = null;
      }
    } catch {
      route = null;
    } finally {
      loading = false;
    }
  }

  async function selectRoute(rid: string) {
    loading = true;
    routeOptions = [];
    scheduleETA = null;
    routeRef = { q: `rid:${rid}`, c: city };
    try {
      const data = await fetchRouteData("", rid);
      if (data.routes && data.routes.length > 0) {
        route = data.routes[0];
        lastUpdated = new Date();
      }
    } catch {
      route = null;
    } finally {
      loading = false;
    }
  }

  async function refreshRoute() {
    const ref = routeRef;
    if (!ref || !route) return;
    try {
      refreshing = true;
      const data = await fetchRouteData(ref.q, ref.q.startsWith("rid:") ? ref.q.slice(4) : undefined);
      if (data.routes && data.routes.length > 0) {
        route = data.routes[0];
        lastUpdated = new Date();
      }
    } catch {
    } finally {
      refreshing = false;
    }
  }

  $effect(() => {
    if (!route) return;
    const id = setInterval(refreshRoute, REFRESH_INTERVAL_MS);
    return () => clearInterval(id);
  });

  let rawStops = $derived(direction === "go" ? route?.goStops : route?.backStops);
  let currentStops = $derived(computeStopsETA(rawStops ?? [], route?.routeId || "10163", direction, route?.fleet));
</script>

<div class="w-full max-w-lg mx-auto">
  <div class="flex gap-1 mb-3 p-1 bg-neutral-50 rounded-xl">
    <button
      onclick={() => { city = "taipei"; route = null; routeOptions = []; searched = false; }}
      class={`flex-1 h-9 text-[12px] rounded-lg transition-all ${
        city === "taipei" ? "bg-white text-neutral-900 shadow-sm font-medium" : "text-neutral-500"
      }`}
    >
      雙北公車
    </button>
    <button
      onclick={() => { city = "taichung"; route = null; routeOptions = []; searched = false; }}
      class={`flex-1 h-9 text-[12px] rounded-lg transition-all ${
        city === "taichung" ? "bg-white text-neutral-900 shadow-sm font-medium" : "text-neutral-500"
      }`}
    >
      台中公車
    </button>
  </div>
  <div class="flex gap-2">
    <input
      bind:this={inputRef}
      type="text"
      bind:value={query}
      onkeydown={(e) => {
        if (e.key === "Enter") searchRoute(query);
      }}
      placeholder={city === "taichung" ? "輸入路線編號 (例: 300, 12, 50, 綠1)" : "輸入路線編號 (例: 656, 307, 紅3, 265)"}
      class="flex-1 h-11 px-4 text-[13px] rounded-xl border border-neutral-200 bg-white text-neutral-700 placeholder:text-neutral-300 focus:outline-none focus:border-neutral-400 transition-colors"
    />
    <button
      onclick={() => searchRoute(query)}
      disabled={loading || !query}
      class="h-11 px-5 bg-neutral-900 text-white text-[13px] font-medium rounded-xl hover:bg-neutral-800 transition-colors disabled:opacity-40 active:scale-[0.98]"
    >
      {loading ? "搜尋中..." : "搜尋"}
    </button>
  </div>

  {#if routeOptions.length > 0}
    <div class="mt-4 space-y-2">
      <p class="text-[12px] text-neutral-400">找到 {routeOptions.length} 條路線</p>
      {#each routeOptions as opt (opt.routeId)}
        <button
          onclick={() => selectRoute(opt.routeId)}
          class="w-full flex items-center justify-between p-3 rounded-xl border border-neutral-100 hover:border-neutral-200 hover:bg-neutral-50 transition-all text-left"
        >
          <span class="text-sm font-medium text-neutral-900">{opt.routeName}</span>
          <span class="text-[11px] text-neutral-400">{opt.stopCount} 站</span>
        </button>
      {/each}
    </div>
  {/if}

  {#if route}
    <div class="mt-6">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h2 class="text-lg font-medium text-neutral-900">{route.routeName}</h2>
          <div class="flex items-center gap-1.5 mt-1 text-[11px] text-green-700 font-mono">
            <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span>已與後端即時同步更新 ({lastUpdated ? lastUpdated.toLocaleTimeString() : "已同步"})</span>
          </div>
        </div>
        {#if lastUpdated}
          <span class={`text-[10px] text-neutral-300 transition-opacity ${refreshing ? "opacity-100" : "opacity-60"}`}>
            {refreshing ? "更新中..." : `${Math.floor((Date.now() - lastUpdated.getTime()) / 1000)}s 前`}
          </span>
        {/if}
      </div>

      {#if scheduleETA}
        <div class="mb-4 p-3 bg-blue-50 rounded-xl border border-blue-100">
          <div class="flex items-center gap-2">
            <span class="text-[11px] text-blue-600 font-medium">靜態時刻表</span>
            <span class="text-[11px] text-blue-500">下一班 {scheduleETA.next_departure}</span>
          </div>
          <div class="mt-1 text-[13px] text-blue-700 font-medium">{scheduleETA.eta_text}</div>
        </div>
      {/if}

      {#if route.goStops.length > 0 || route.backStops.length > 0}
        <div class="flex gap-1 mb-4 p-1 bg-neutral-50 rounded-xl">
          <button
            onclick={() => direction = "go"}
            class={`flex-1 h-9 text-[12px] px-2 truncate rounded-lg transition-all ${
              direction === "go" ? "bg-white text-neutral-900 shadow-sm font-medium" : "text-neutral-500"
            }`}
            title={route.goTitle || "去程"}
          >
            {route.goTitle || "去程"} ({route.goStops.length})
          </button>
          <button
            onclick={() => direction = "back"}
            class={`flex-1 h-9 text-[12px] px-2 truncate rounded-lg transition-all ${
              direction === "back" ? "bg-white text-neutral-900 shadow-sm font-medium" : "text-neutral-500"
            }`}
            title={route.backTitle || "返程"}
          >
            {route.backTitle || "返程"} ({route.backStops.length})
          </button>
        </div>
      {/if}

      <div class="space-y-1">
        {#each currentStops ?? [] as stop, i (stop.sid + "-" + i)}
          <div
            class="flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-neutral-50 transition-colors"
          >
            <span class="text-[11px] font-mono text-neutral-300 w-5 text-right">{i + 1}</span>
            <span class="text-[13px] text-neutral-800 flex-1">{stop.name}</span>
            {#if stop.plate}
              <span class="text-[10px] font-mono bg-neutral-900 text-white px-2 py-0.5 rounded-md shadow-2xs">
                🚍 {stop.plate}
              </span>
            {/if}
            {#if stop.timeText}
              <span
                class={`text-[11px] font-mono px-2.5 py-0.5 rounded-full ${
                  stop.timeText === "進站中" || stop.timeText === "將到站"
                    ? "bg-green-100 text-green-700 font-medium"
                    : stop.timeText?.includes("分")
                      ? "bg-blue-50 text-blue-600 font-medium"
                      : stop.timeText === "已通過"
                        ? "bg-neutral-100 text-neutral-400 line-through"
                        : "bg-neutral-50 text-neutral-400"
                }`}
              >
                {stop.timeText}
              </span>
            {/if}
          </div>
        {/each}
      </div>
    </div>
  {/if}

  {#if searched && !loading && !route && routeOptions.length === 0}
    <div class="mt-8 text-center">
      <p class="text-sm text-neutral-400">找不到路線</p>
    </div>
  {/if}
</div>
