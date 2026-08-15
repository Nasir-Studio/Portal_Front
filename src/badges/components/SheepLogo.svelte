<script>
  let { size = 64, class: className = '' } = $props()
</script>

<img
  class={className}
  src="/logo.png"
  width={size}
  height={size}
  alt="OviNas"
  role="img"
  aria-label="OviNas"
  draggable="false"
/>
