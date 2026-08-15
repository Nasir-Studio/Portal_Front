<script>
  let { lines, active, onchange } = $props()
</script>

<div class="lines shell" style="padding-top: 16px;">
  <button
    class="chip chip--all {active === 'all' ? 'chip--active' : ''}"
    onclick={() => onchange('all')}>全部</button>
  {#each lines as line (line.key)}
    <button
      class="chip {active === line.key ? 'chip--active' : ''}"
      onclick={() => onchange(line.key)}>
      <span
        class="line-badge"
        style="background: {line.color}; color: {line.ink ? '#171512' : '#f4efe6'}; border-color: {line.color};">{line.code}</span>
    </button>
  {/each}
</div>
