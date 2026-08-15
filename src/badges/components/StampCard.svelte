<script>
  import { lineColor, lineCode, lineText } from '$lib/stations'

  let { station, record, onclick } = $props()

  const locked = $derived(!record)
  const color = lineColor(station.line)
</script>

<button
  class="stamp-card {locked ? 'stamp-card--locked' : ''}"
  onclick={() => onclick(station)}
  aria-label="{station.name}">
  <span
    class="line-badge stamp-card__line"
    style="background: {color}; color: {lineText(station.line)};">{lineCode(station.line)}</span>
  {#if record}
    <span class="stamp-card__state" style="background: {color};" aria-hidden="true"></span>
  {/if}
  <div class="stamp-card__img-wrap">
    <img
      class="stamp-card__img"
      src={station.img}
      alt={station.name}
      loading="lazy"
      decoding="async" />
  </div>
  <div class="stamp-card__name">{station.name}</div>
  <div class="stamp-card__meta">
    <span class="mono">{station.code}</span>
    {station.en}
    {#if record}
      <span class="mono"> · {new Date(record.collectedAt).toLocaleDateString('zh-Hant')}</span>
    {/if}
  </div>
</button>
