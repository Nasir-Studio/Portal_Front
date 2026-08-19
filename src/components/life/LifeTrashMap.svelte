<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  interface Truck {
    line_id: string;
    car: string;
    time: string;
    location: string;
    longitude: number;
    latitude: number;
    city: string;
  }

  let selectedCity = 'newtaipei';
  let trucks: Truck[] = [];
  let loading = true;
  let errorMsg = '';
  let lastUpdated = '';

  let mapContainer: HTMLElement;
  let map: any = null;
  let markersGroup: any = null;
  let timer: any = null;

  async function fetchTrucks() {
    try {
      const res = await fetch(`https://api.nsir.uk/life/trucks?city=${selectedCity}`);
      if (!res.ok) throw new Error('無法取得即時資料');
      const data = await res.json();
      trucks = data.trucks || [];
      lastUpdated = new Date().toLocaleTimeString('zh-TW', { hour12: false });
      errorMsg = '';
      updateMarkers();
    } catch (err: any) {
      errorMsg = '資料連線失敗，將於下個週期重新連線';
    } finally {
      loading = false;
    }
  }

  function updateMarkers() {
    if (!map || typeof window === 'undefined' || !(window as any).L) return;
    const L = (window as any).L;

    if (!markersGroup) {
      markersGroup = L.layerGroup().addTo(map);
    } else {
      markersGroup.clearLayers();
    }

    trucks.forEach((t) => {
      if (!t.latitude || !t.longitude) return;
      const marker = L.circleMarker([t.latitude, t.longitude], {
        radius: 7,
        fillColor: '#1c1c1c',
        color: '#ffffff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.9,
      });

      marker.bindPopup(`
        <div style="font-family: sans-serif; padding: 2px;">
          <strong style="font-size: 1rem;">🚛 車牌：${t.car || t.line_id || '垃圾車'}</strong><br/>
          <span style="font-size: 0.85rem; color: #555;">路線ID：${t.line_id}</span><br/>
          <span style="font-size: 0.85rem; color: #555;">位置：${t.location || '即時動態中'}</span><br/>
          <span style="font-size: 0.78rem; color: #888;">更新時間：${t.time || lastUpdated}</span>
        </div>
      `);

      markersGroup.addLayer(marker);
    });
  }

  function changeCity(city: string) {
    selectedCity = city;
    loading = true;
    fetchTrucks();

    if (map) {
      if (city === 'newtaipei') {
        map.setView([25.012, 121.465], 12);
      } else if (city === 'taichung') {
        map.setView([24.163, 120.647], 12);
      }
    }
  }

  onMount(() => {
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    const initMap = () => {
      const L = (window as any).L;
      if (!L || !mapContainer) return;

      map = L.map(mapContainer).setView([25.012, 121.465], 12);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(map);

      fetchTrucks();

      timer = setInterval(() => {
        if (document.visibilityState === 'visible') {
          fetchTrucks();
        }
      }, 15000);
    };

    if ((window as any).L) {
      initMap();
    } else {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => initMap();
      document.head.appendChild(script);
    }
  });

  onDestroy(() => {
    if (timer) clearInterval(timer);
    if (map) map.remove();
  });
</script>

<div class="life-wrap">

  <div class="control-panel module">
    <div class="panel-left">
      <span class="panel-label">選擇縣市：</span>
      <div class="city-btns">
        <button
          type="button"
          class="btn {selectedCity === 'newtaipei' ? '' : 'btn--ghost'}"
          on:click={() => changeCity('newtaipei')}
        >
          新北市
        </button>
        <button
          type="button"
          class="btn {selectedCity === 'taichung' ? '' : 'btn--ghost'}"
          on:click={() => changeCity('taichung')}
        >
          臺中市
        </button>
      </div>
    </div>

    <div class="panel-right">
      {#if loading}
        <span class="status-tag loading">⏳ 載入中...</span>
      {:else}
        <span class="status-tag success">即時連線中</span>
        <span class="update-time">最後更新：{lastUpdated}</span>
        <span class="count-tag">目前在線：<b>{trucks.length}</b> 輛</span>
      {/if}
    </div>
  </div>

  {#if errorMsg}
    <div class="error-banner">{errorMsg}</div>
  {/if}

  <div class="map-container" bind:this={mapContainer}></div>
</div>

<style>
  .life-wrap {
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
  }

  .control-panel {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.4rem;
    background: var(--surface);
    border: 1px solid var(--border);
    flex-wrap: wrap;
    gap: 1rem;
  }

  .panel-left, .panel-right {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    flex-wrap: wrap;
  }

  .panel-label {
    font-size: 0.9rem;
    font-weight: 500;
    color: var(--ink);
  }

  .city-btns {
    display: flex;
    gap: 0.5rem;
  }

  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.4rem 0.9rem;
    font-family: var(--font-sans);
    font-size: 0.85rem;
    font-weight: 500;
    color: var(--white);
    background: var(--ink);
    border: 1px solid var(--ink);
    cursor: pointer;
    transition: background 0.2s ease, color 0.2s ease;
  }

  .btn--ghost {
    color: var(--ink);
    background: transparent;
    border-color: var(--border-strong);
  }

  .btn--ghost:hover {
    background: var(--bg-soft);
  }

  .status-tag {
    font-size: 0.75rem;
    font-weight: 600;
    padding: 0.2rem 0.5rem;
  }

  .status-tag.loading {
    background: var(--bg-soft);
    color: var(--ink-3);
  }

  .status-tag.success {
    background: #e6f4ea;
    color: #137333;
  }

  .update-time, .count-tag {
    font-size: 0.82rem;
    color: var(--ink-3);
  }

  .count-tag b {
    color: var(--ink);
  }

  .error-banner {
    background: #fce8e6;
    color: #c5221f;
    padding: 0.8rem 1.2rem;
    font-size: 0.88rem;
  }

  .map-container {
    width: 100%;
    height: 600px;
    background: var(--bg-soft);
    border: 1px solid var(--border);
    z-index: 1;
  }
</style>
