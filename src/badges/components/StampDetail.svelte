<script>
  import { db, ref, set } from '$lib/firebase'
  import { user, collected } from '$lib/store'
  import { lineColor, lineCode, lineText, byId, transferSiblings } from '$lib/stations'
  import LeafletMap from './LeafletMap.svelte'

  let { station, record, onclose } = $props()

  let phase = $state('idle')
  let pressed = $state(false)
  let errMsg = $state('')
  let gpsNote = $state('')
  let saved = $state(null)
  let loc = $state(null)
  let coRecorded = $state([])

  const fmtTime = (t) => new Date(t).toLocaleString('zh-Hant', {
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
  })

  function directionOf(deg) {
    if (deg == null) return ''
    const dirs = ['北', '北北東', '東北', '東東北', '東', '東東南', '東南', '南南東',
      '南', '南南西', '西南', '西西南', '西', '西西北', '西北', '北北西']
    return dirs[Math.round(deg / 22.5) % 16]
  }

  function coRecordLabel(s) {
    return lineCode(s.line) + ' ' + s.name
  }

  function getPosition() {
    return new Promise((resolve, reject) => {
      if (!('geolocation' in navigator)) {
        reject(new Error('unsupported'))
        return
      }
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 30000
      })
    })
  }

  async function collect() {
    if (phase === 'locating' || phase === 'saving') return
    phase = 'locating'
    errMsg = ''
    gpsNote = ''
    saved = null
    loc = null
    coRecorded = []

    let coords = null
    try {
      const pos = await getPosition()
      coords = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        accuracy: pos.coords.accuracy ?? null,
        heading: pos.coords.heading ?? null
      }
    } catch (e) {
      gpsNote = '無法取得目前位置（已開啟定位權限時精確度最佳），仍記錄為「未定位」'
    }

    phase = 'saving'
    try {
      const uid = $user?.uid
      if (!uid) throw new Error('no user')
      const now = Date.now()
      const payload = {
        stationId: station.id,
        stationName: station.name,
        lineName: station.lineName,
        collectedAt: now,
        lat: coords?.lat ?? null,
        lng: coords?.lng ?? null,
        accuracy: coords?.accuracy ?? null,
        heading: coords?.heading ?? null,
        source: coords ? 'gps' : 'manual'
      }
      const siblings = transferSiblings(station.id)
      const entries = [payload, ...siblings.map((sid) => {
        const s = byId(sid)
        return { ...payload, stationId: s.id, stationName: s.name, lineName: s.lineName }
      })]
      await Promise.all(entries.map((e) => set(ref(db, `users/${uid}/stamps/${e.stationId}`), e)))
      collected.update((c) => ({ ...c, ...Object.fromEntries(entries.map((e) => [e.stationId, e])) }))
      saved = payload
      coRecorded = siblings.map((sid) => byId(sid))
      if (coords) loc = coords
      pressed = true
      phase = 'done'
    } catch (e) {
      console.error(e)
      errMsg = '儲存失敗，請檢查網路後重試'
      phase = 'error'
    }
  }
</script>

<div
  class="modal-backdrop"
  role="presentation"
  onclick={(e) => {
    if (e.target === e.currentTarget) onclose()
  }}
  onkeydown={(e) => e.key === 'Escape' && onclose()}>
  <div
    class="modal"
    role="dialog"
    aria-modal="true"
    aria-label={station.name}
    tabindex="-1">
    <button class="modal__close" onclick={onclose} aria-label="關閉">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <path d="M6 6l12 12M18 6L6 18" />
      </svg>
    </button>

    <div class="modal__badge">
      <img
        class="modal__badge-img {pressed ? 'is-pressed' : ''}"
        src={station.img}
        alt={station.name}
        style="opacity: {record ? 1 : 0.4};"
        draggable="false" />
      {#if station.imgAlt}
        <img
          class="modal__badge-img modal__badge-img--alt"
          src={station.imgAlt}
          alt={`${station.name} 插畫版`}
          style="opacity: {record ? 1 : 0.4};"
          draggable="false" />
      {/if}
    </div>

    <h2 class="modal__title">
      <span
        class="line-badge"
        style="background: {lineColor(station.line)}; color: {lineText(station.line)};">{lineCode(station.line)}</span>
      {station.name}
    </h2>
    <p class="modal__sub">
      {station.en}
      <span style="color: var(--text-faint);"> · {station.lineName}</span>
    </p>

    {#if station.desc}
      <p class="modal__desc">{station.desc}</p>
    {/if}

    <div style="margin-top: 18px;">
      {#if phase === 'done' || record}
        <div class="collect-done anim-fade">
          <p class="mono" style="color: var(--text-dim); font-size: 12px; letter-spacing: 0.02em;">
            已收集 — {saved ? fmtTime(saved.collectedAt) : (record ? fmtTime(record.collectedAt) : '')}
          </p>

          {#if coRecorded.length > 0}
            <p class="mono co-recorded" style="border-color: {lineColor(station.line)};">
              轉乘站同時記錄：{coRecorded.map(coRecordLabel).join('、')}
            </p>
          {/if}

          {#if saved?.lat != null || record?.lat != null}
            <div class="collect-meta">
              <span class="mono">緯度 {((saved ?? record)?.lat ?? 0).toFixed(6)}</span>
              <span class="mono">經度 {((saved ?? record)?.lng ?? 0).toFixed(6)}</span>
              {#if (saved ?? record)?.accuracy != null}
                <span class="mono">精度 ±{(saved ?? record).accuracy.toFixed(0)}m</span>
              {/if}
              {#if (saved ?? record)?.heading != null}
                <span class="mono">方位 {(saved ?? record).heading.toFixed(0)}° {directionOf((saved ?? record).heading)}</span>
              {/if}
            </div>
            <LeafletMap lat={(saved ?? record).lat} lng={(saved ?? record).lng} accuracy={(saved ?? record).accuracy} />
          {:else if phase === 'done'}
            <p style="font-size: 13px; color: var(--text-faint); text-align: center; margin-top: 10px;">
              已記錄為「未定位」。開啟定位權限後再蓋章，即可在地圖留下足跡。
            </p>
          {/if}
        </div>
      {:else}
        <button
          class="btn btn--line"
          style="width: 100%; background: {lineColor(station.line)}; color: {lineText(station.line)};"
          onclick={collect}
          disabled={phase === 'locating' || phase === 'saving'}>
          {#if phase === 'locating'}
            <span class="mono">定位中…</span>
          {:else if phase === 'saving'}
            <span class="mono">蓋章中…</span>
          {:else}
            <span>蓋章收集</span>
          {/if}
        </button>
        <p style="font-size: 12px; color: var(--text-faint); text-align: center; margin-top: 10px;">
          按下後將記錄此刻位置、方位與時間，留下專屬於你的足跡。
        </p>
      {/if}

      {#if gpsNote}
        <p style="font-size: 12px; color: var(--warn); margin-top: 10px; text-align: center;">{gpsNote}</p>
      {/if}
      {#if errMsg}
        <p style="font-size: 12px; color: var(--danger); margin-top: 10px; text-align: center;">{errMsg}</p>
      {/if}
    </div>
  </div>
</div>

<style>
  .collect-done {
    animation: fade 0.3s ease both;
  }

  .collect-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 6px 14px;
    justify-content: center;
    margin-top: 12px;
    font-size: 12px;
    color: var(--text-dim);
  }

  .collect-meta .mono {
    font-size: 12px;
  }

  .co-recorded {
    margin-top: 10px;
    padding: 8px 12px;
    border-left: 3px solid;
    border-radius: 2px;
    font-size: 12px;
    color: var(--text-dim);
    background: var(--bg-soft);
    text-align: center;
  }
</style>
