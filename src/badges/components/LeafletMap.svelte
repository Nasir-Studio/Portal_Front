<script>
  import { onMount } from 'svelte'
  import L from 'leaflet'
  import 'leaflet/dist/leaflet.css'

  let { lat, lng, accuracy, height = 260 } = $props()

  let el
  let map
  let tile

  onMount(() => {
    map = L.map(el, { scrollWheelZoom: false, attributionControl: false }).setView([lat, lng], 16)
    tile = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 20
    }).addTo(map)

    const icon = L.divIcon({
      className: '',
      html: '<div class="stamp-dot"></div>',
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    })

    L.marker([lat, lng], { icon }).addTo(map)

    if (accuracy && accuracy > 0 && accuracy < 2000) {
      L.circle([lat, lng], {
        radius: accuracy,
        color: 'var(--text)',
        weight: 1,
        opacity: 0.5,
        fillColor: 'var(--text)',
        fillOpacity: 0.08
      }).addTo(map)
    }

    setTimeout(() => map.invalidateSize(), 60)

    return () => {
      map.remove()
      map = null
    }
  })
</script>

<div class="map" style="height: {height}px;" bind:this={el}></div>
