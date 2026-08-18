<script lang="ts">
  import { onMount } from "svelte";
  import { getLocation, navigate } from "@/lib/router.svelte";
  import { scheduleCities } from "@/lib/cities";
  import type { ScheduleEntry, CollectionPoint, CollectionLine } from "@/lib/types";
  import Navbar from "@/components/Navbar.svelte";

  const DAYS = [
    { key: 0, label: "日" },
    { key: 1, label: "一" },
    { key: 2, label: "二" },
    { key: 3, label: "三" },
    { key: 4, label: "四" },
    { key: 5, label: "五" },
    { key: 6, label: "六" },
  ];

  const TIME_RANGES = [
    { key: 0, label: "所有時段" },
    { key: 1, label: "上午 06:00–11:59" },
    { key: 2, label: "下午 12:00–17:59" },
    { key: 3, label: "晚上 18:00–23:59" },
  ];

  const CITY_SCHEDULE_LINKS: Record<string, string> = {
    taichung: "https://cleaner.epb.taichung.gov.tw/schedule.aspx",
  };

  interface DayBadge {
    label: string;
    title: string;
    className: string;
    style?: string;
  }

  function fmtMin(m: number): string {
    const h = Math.floor(m / 60);
    const mm = m % 60;
    return `${h}:${String(mm).padStart(2, "0")}`;
  }

  function calcTimeStatus(scheduledTime: number, delay: number | null): { label: string; className: string; isPassed: boolean } {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    if (currentMinutes > scheduledTime + 20) {
      return { label: "今日班次已結束", className: "bg-neutral-100 text-neutral-400 font-normal", isPassed: true };
    }
    if (currentMinutes >= scheduledTime - 15 && currentMinutes <= scheduledTime + 20) {
      let delayText = "";
      if (typeof delay === "number" && !isNaN(delay) && delay !== 0) {
        delayText = delay > 0 ? ` (延誤${delay}分)` : ` (提前${Math.abs(delay)}分)`;
      }
      return { label: `執勤收運中${delayText}`, className: "bg-green-100 text-green-700 font-medium", isPassed: false };
    }
    return { label: "尚未執勤", className: "bg-blue-50 text-blue-600 font-normal", isPassed: false };
  }

  function isOfficialCity(id: string): boolean {
    return (scheduleCities.find((c) => c.id === id)?.official ?? false) as boolean;
  }

  function dayBadgesOfficial(p: {
    garbageDay?: number[];
    recycleDay?: number[];
    foodscrapDay?: number[];
  }): DayBadge[] {
    return [0, 1, 2, 3, 4, 5, 6].map((d) => {
      const gSet = new Set(p.garbageDay ?? []);
      const rSet = new Set(p.recycleDay ?? []);
      const fSet = new Set(p.foodscrapDay ?? []);
      const isG = gSet.has(d),
        isR = rSet.has(d),
        isF = fSet.has(d);
      const cnt = (isG ? 1 : 0) + (isR ? 1 : 0) + (isF ? 1 : 0);
      const title = `${DAYS[d]?.label}${isG ? " 一般垃圾" : ""}${isR ? " 資源回收" : ""}${isF ? " 廚餘" : ""}`;
      const label = DAYS[d]?.label ?? "";
      if (cnt === 0)
        return {
          label,
          title,
          className:
            "inline-flex items-center justify-center w-6 h-6 rounded-full bg-neutral-100 text-neutral-300 text-[10px] font-mono flex-shrink-0",
        };
      if (cnt === 1) {
        const bg = isG ? "bg-neutral-900 text-white" : isR ? "bg-blue-500 text-white" : "bg-green-600 text-white";
        return {
          label,
          title,
          className: `inline-flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-mono flex-shrink-0 ${bg}`,
        };
      }
      const colors = ["#171717", "#3b82f6", "#16a34a"];
      const active = [isG, isR, isF];
      const seg = 100 / cnt;
      let s = 0;
      const slices: string[] = [];
      active.forEach((a, i) => {
        if (a) {
          slices.push(`${colors[i]} ${s}% ${s + seg}%`);
          s += seg;
        }
      });
      return {
        label,
        title,
        className:
          "inline-flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-mono text-white flex-shrink-0",
        style: `background:conic-gradient(${slices.join(",")})`,
      };
    });
  }

  function dayBadgesSchedule(s: { garbageDay?: number[]; recycleDay?: number[] }): DayBadge[] {
    return [0, 1, 2, 3, 4, 5, 6].map((d) => {
      const gSet = new Set(s.garbageDay ?? []);
      const rSet = new Set(s.recycleDay ?? []);
      const isG = gSet.has(d),
        isR = rSet.has(d);
      const cnt = (isG ? 1 : 0) + (isR ? 1 : 0);
      const title = `${DAYS[d]?.label}${isG ? " 一般垃圾" : ""}${isR ? " 資源回收" : ""}`;
      const label = DAYS[d]?.label ?? "";
      if (cnt === 0)
        return {
          label,
          title,
          className:
            "inline-flex items-center justify-center w-6 h-6 rounded-full bg-neutral-100 text-neutral-300 text-[10px] font-mono flex-shrink-0",
        };
      if (cnt === 1) {
        const bg = isG ? "bg-neutral-900 text-white" : "bg-blue-500 text-white";
        return {
          label,
          title,
          className: `inline-flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-mono flex-shrink-0 ${bg}`,
        };
      }
      return {
        label,
        title,
        className:
          "inline-flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-mono text-white flex-shrink-0",
        style: "background:conic-gradient(#171717 0% 50%, #3b82f6 50% 100%)",
      };
    });
  }

  const location = getLocation();
  const initialCity = new URLSearchParams(location.state.search).get("city") || "newtaipei";

  let selectedCity = $state(initialCity);
  let official = $derived(isOfficialCity(selectedCity));

  let schedules = $state<ScheduleEntry[]>([]);
  let points = $state<CollectionPoint[]>([]);
  let loading = $state(true);
  let error = $state<string | null>(null);
  let searchQuery = $state("");
  let debouncedQuery = $state("");
  let selectedDay = $state<number | null>(null);
  let timeRange = $state(0);
  let userLat = $state<number | null>(null);
  let userLon = $state<number | null>(null);
  let page = $state(0);
  let hasMore = $state(false);
  let loadingMore = $state(false);
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;

  interface GroupedShift {
    lineId: string;
    lineName: string;
    time: string;
    scheduledTime: number;
    delay: number | null;
    garbageDay: number[];
    recycleDay: number[];
    foodscrapDay: number[];
    statusInfo: { label: string; className: string; isPassed: boolean };
  }

  interface GroupedStationCard {
    stopName: string;
    village: string;
    shifts: GroupedShift[];
  }

  let groupedPoints = $derived.by(() => {
    const map = new Map<string, GroupedStationCard>();
    for (const p of points) {
      const key = p.stopName.trim();
      const status = calcTimeStatus(p.scheduledTime || 1080, typeof p.delay === "number" && !isNaN(p.delay) ? p.delay : null);
      const shiftItem: GroupedShift = {
        lineId: p.lineId,
        lineName: p.lineName || "定點清運路線",
        time: p.time,
        scheduledTime: p.scheduledTime || 1080,
        delay: typeof p.delay === "number" && !isNaN(p.delay) ? p.delay : null,
        garbageDay: p.garbageDay || [0, 1, 2, 3, 4, 5, 6],
        recycleDay: p.recycleDay || [1, 2, 4, 5],
        foodscrapDay: p.foodscrapDay || [0, 1, 2, 3, 4, 5, 6],
        statusInfo: status
      };

      if (!map.has(key)) {
        map.set(key, {
          stopName: p.stopName,
          village: p.village || "",
          shifts: [shiftItem]
        });
      } else {
        const existing = map.get(key)!;
        if (!existing.shifts.some(s => s.lineName === shiftItem.lineName && s.time === shiftItem.time)) {
          existing.shifts.push(shiftItem);
        }
      }
    }
    return Array.from(map.values());
  });

  onMount(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          userLat = pos.coords.latitude;
          userLon = pos.coords.longitude;
        },
        () => {}
      );
    }
  });

  let cachedCollectionPoints: CollectionPoint[] | null = null;

  async function loadAllCollectionPoints(): Promise<CollectionPoint[]> {
    if (cachedCollectionPoints) return cachedCollectionPoints;
    try {
      const res = await fetch("/data/collection_points.json");
      if (res.ok) {
        cachedCollectionPoints = await res.json();
        return cachedCollectionPoints || [];
      }
    } catch {}
    return [];
  }

  async function fetchOfficial(
    city: string,
    q: string,
    day: number | null,
    range: number,
    pageNum: number,
    append: boolean
  ) {
    if (append) loadingMore = true;
    else loading = true;
    error = null;
    try {
      let fetchOk = false;

      const records = await loadAllCollectionPoints();
      if (records.length > 0) {
        let filtered = records;
        if (q) {
          const qLower = q.toLowerCase();
          filtered = filtered.filter(
            (p) =>
              p.stopName.toLowerCase().includes(qLower) ||
              (p.lineName && p.lineName.toLowerCase().includes(qLower)) ||
              (p.village && p.village.toLowerCase().includes(qLower))
          );
        }
        if (day !== null) {
          filtered = filtered.filter((p) => (p.garbageDay ?? []).includes(day));
        }

        const pageSize = 30;
        const start = pageNum * pageSize;
        const pageData = filtered.slice(start, start + pageSize);
        if (append) {
          points = [...points, ...pageData];
        } else {
          points = pageData;
        }
        hasMore = start + pageSize < filtered.length;
        fetchOk = true;
      }

      if (!fetchOk) {
        const params = new URLSearchParams({ city, page: String(pageNum) });
        if (q) params.set("q", q);
        if (day !== null) params.set("day", String(day));
        if (range) params.set("range", String(range));

        const res = await fetch(`https://api.nsir.uk/life/collection-points?${params}`);
        if (res.ok) {
          const data = await res.json();
          if (data.points && data.points.length > 0) {
            if (append) {
              points = [...points, ...data.points];
            } else {
              points = data.points;
            }
            hasMore = data.hasMore || false;
            fetchOk = true;
          }
        }
      }
    } catch {
      error = null;
    } finally {
      loading = false;
      loadingMore = false;
    }
  }

  async function fetchLegacy(
    city: string,
    q: string,
    day: number | null,
    pageNum: number,
    append: boolean
  ) {
    if (append) loadingMore = true;
    else loading = true;
    error = null;
    try {
      const params = new URLSearchParams({ city, page: String(pageNum) });
      if (q) params.set("q", q);
      if (day !== null) params.set("day", String(day));
      const res = await fetch(`/api/schedule?${params}`);
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      if (append) {
        schedules = [...schedules, ...(data.schedules || [])];
      } else {
        schedules = data.schedules || [];
      }
      hasMore = data.hasMore || false;
    } catch {
      error = "無法取得時刻表";
    } finally {
      loading = false;
      loadingMore = false;
    }
  }

  $effect(() => {
    page = 0;
    if (isOfficialCity(selectedCity)) {
      fetchOfficial(selectedCity, debouncedQuery, selectedDay, timeRange, 0, false);
    } else {
      fetchLegacy(selectedCity, debouncedQuery, selectedDay, 0, false);
    }
  });

  function retry() {
    page = 0;
    if (official) {
      fetchOfficial(selectedCity, debouncedQuery, selectedDay, timeRange, 0, false);
    } else {
      fetchLegacy(selectedCity, debouncedQuery, selectedDay, 0, false);
    }
  }

  function loadMore() {
    const next = page + 1;
    page = next;
    if (isOfficialCity(selectedCity)) {
      fetchOfficial(selectedCity, debouncedQuery, selectedDay, timeRange, next, true);
    } else {
      fetchLegacy(selectedCity, debouncedQuery, selectedDay, next, true);
    }
  }

  function handleSearchChange(value: string) {
    searchQuery = value;
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      debouncedQuery = value;
    }, 300);
  }

  function handleCityChange(city: string) {
    selectedCity = city;
    navigate(`/schedule?city=${city}`);
  }

  function handleDayToggle(day: number) {
    selectedDay = selectedDay === day ? null : day;
  }

  let currentCityName = $derived(scheduleCities.find((c) => c.id === selectedCity)?.name || selectedCity);
</script>

<div class="min-h-screen bg-white">
  <Navbar>
    <select
      value={selectedCity}
      onchange={(e) => handleCityChange(e.currentTarget.value)}
      class="text-[13px] px-3 py-1.5 rounded-lg border border-neutral-200 bg-white text-neutral-700 appearance-none cursor-pointer"
    >
      {#each scheduleCities as city}
        <option value={city.id}>{city.name}</option>
      {/each}
    </select>
  </Navbar>

  <main class="pt-14">
    <section class="px-6 py-16 md:py-20">
      <div class="max-w-6xl mx-auto">
        <div class="animate-fade-up">
          <p class="text-[11px] tracking-[0.3em] uppercase text-neutral-400 mb-4 font-mono">
            時刻表
          </p>
          <h2 class="text-2xl md:text-3xl font-light tracking-tight text-neutral-900">
            {currentCityName}
            {#if official}
              <span
                class="ml-2 align-middle text-[10px] tracking-widest font-mono text-green-600 border border-green-200 rounded-full px-2 py-0.5"
              >
                官方表定路線 (共 26,659 站)
              </span>
            {/if}
          </h2>
        </div>

        <div class="mt-8 animate-fade-up delay-100 flex flex-wrap gap-3 items-center">
          <input
            type="text"
            value={searchQuery}
            oninput={(e) => handleSearchChange(e.currentTarget.value)}
            placeholder="搜尋地址、門牌、路名或關鍵字 (例: 四川路, 府中路)..."
            class="w-full max-w-md h-10 px-4 text-[13px] rounded-xl border border-neutral-200 bg-white text-neutral-700 placeholder:text-neutral-300 focus:outline-none focus:border-neutral-400 transition-colors"
          />
          {#if official}
            <select
              value={timeRange}
              onchange={(e) => (timeRange = parseInt(e.currentTarget.value, 10))}
              class="h-10 px-3 rounded-xl border border-neutral-200 bg-white text-[12px] text-neutral-600 focus:outline-none focus:border-neutral-400 transition-colors"
            >
              {#each TIME_RANGES as r}
                <option value={r.key}>{r.label}</option>
              {/each}
            </select>
          {/if}
        </div>

        <div class="mt-6 flex flex-wrap gap-2 animate-fade-up delay-200">
          {#each DAYS as day}
            <button
              onclick={() => handleDayToggle(day.key)}
              class="h-9 px-3 rounded-full text-[12px] transition-all {selectedDay === day.key
                ? 'bg-neutral-900 text-white'
                : 'bg-neutral-50 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700'}"
            >
              {day.label}
            </button>
          {/each}
        </div>
      </div>
    </section>

    <section class="px-6 pb-32">
      <div class="max-w-6xl mx-auto">
        {#if loading}
          <div class="flex items-center justify-center py-20">
            <div class="w-5 h-5 border-2 border-neutral-200 border-t-neutral-600 rounded-full animate-spin"></div>
          </div>
        {:else if error}
          <div class="text-center py-20">
            <p class="text-sm text-neutral-500 mb-3">{error}</p>
            <button
              onclick={retry}
              class="text-[12px] font-medium text-neutral-900 underline underline-offset-2"
            >
              重試
            </button>
          </div>
        {:else if official}
          {#if groupedPoints.length === 0}
            <div class="text-center py-20">
              {#if debouncedQuery === "" && selectedDay === null && timeRange === 0}
                <p class="text-sm text-neutral-400">暫無官方表定路線資料</p>
              {:else}
                <p class="text-sm text-neutral-400">沒有找到結果</p>
              {/if}
            </div>
          {:else}
            <div class="space-y-3">
              {#each groupedPoints as group, i}
                <div
                  class="p-5 rounded-2xl border border-neutral-100 hover:border-neutral-200 bg-white transition-all animate-slide-in shadow-xs"
                  style="animation-delay: {Math.min(i * 30, 300)}ms"
                >
                  <div class="mb-3">
                    <p class="text-sm font-medium text-neutral-900">{group.stopName}</p>
                    {#if group.village}
                      <p class="text-[11px] text-neutral-400 mt-0.5">{group.village}</p>
                    {/if}
                  </div>

                  <div class="space-y-2 pt-3 border-t border-neutral-100">
                    {#each group.shifts as shift}
                      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-neutral-50/70 border border-neutral-100/60">
                        <div class="min-w-0">
                          <div class="flex items-center gap-2 flex-wrap">
                            <span class="text-[12px] font-medium text-neutral-800">{shift.lineName}</span>
                            <span class="text-[11px] font-mono text-neutral-500">表定 {shift.time}</span>
                            <span class="text-[10px] font-mono rounded-full px-2 py-0.5 {shift.statusInfo.className}">
                              {shift.statusInfo.label}
                            </span>
                          </div>
                        </div>
                        <div class="flex items-center gap-1 flex-shrink-0">
                          {#each dayBadgesOfficial(shift) as b}
                            <span class={b.className} style={b.style ?? ""} title={b.title}>{b.label}</span>
                          {/each}
                        </div>
                      </div>
                    {/each}
                  </div>
                </div>
              {/each}
              {#if hasMore}
                <div class="pt-6 flex justify-center">
                  <button
                    onclick={loadMore}
                    disabled={loadingMore}
                    class="px-6 py-2.5 rounded-full border border-neutral-200 text-[12px] text-neutral-600 hover:bg-neutral-50 transition-colors disabled:opacity-50"
                  >
                    {loadingMore ? "載入中..." : "載入更多清運點"}
                  </button>
                </div>
              {/if}
            </div>
          {/if}
        {:else}
          {#if schedules.length === 0}
            <div class="text-center py-20">
              {#if debouncedQuery === "" && selectedDay === null && CITY_SCHEDULE_LINKS[selectedCity]}
                <p class="text-sm text-neutral-500 mb-2">此縣市暫無開放時刻表資料</p>
                <a
                  href={CITY_SCHEDULE_LINKS[selectedCity]}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-[12px] font-medium text-neutral-900 underline underline-offset-2 hover:text-neutral-600"
                >
                  前往官方查詢網站
                </a>
              {:else}
                <p class="text-sm text-neutral-400">沒有找到結果</p>
              {/if}
            </div>
          {:else}
            <div class="space-y-2">
              {#each schedules as s, i}
                <div class="p-4 rounded-xl border border-neutral-100 hover:border-neutral-200 bg-white">
                  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div class="min-w-0">
                      <p class="text-sm text-neutral-800 truncate">{s.address}</p>
                      <p class="text-[11px] text-neutral-400 mt-0.5">
                        {s.startTime != null && s.endTime != null
                          ? `${fmtMin(s.startTime)} – ${fmtMin(s.endTime)}`
                          : ""}
                      </p>
                    </div>
                    <div class="flex items-center gap-1 flex-shrink-0">
                      {#each dayBadgesSchedule(s) as b}
                        <span class={b.className} style={b.style ?? ""} title={b.title}>{b.label}</span>
                      {/each}
                    </div>
                  </div>
                </div>
              {/each}
            </div>
          {/if}
        {/if}
      </div>
    </section>
  </main>
</div>
