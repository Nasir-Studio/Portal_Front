<script>
  import { onMount } from 'svelte'
  import { onAuthStateChanged, get, ref, db, auth } from '$lib/firebase'
  import { authReady, user, collected } from '$lib/store'
  import { ALL, LINES } from '$lib/stations'
  import Login from './components/Login.svelte'
  import Header from './components/Header.svelte'
  import SheepLogo from './components/SheepLogo.svelte'
  import LineFilter from './components/LineFilter.svelte'
  import StampCard from './components/StampCard.svelte'
  import StampDetail from './components/StampDetail.svelte'

  let filter = $state('all')
  let selectedId = $state(null)
  let counts = $state({})

  const count = $derived(Object.keys($collected).length)
  const visible = $derived(filter === 'all' ? ALL : ALL.filter((s) => s.line === filter))

  function select(id) {
    selectedId = id
  }

  onMount(async () => {
    onAuthStateChanged(auth, (u) => {
      user.set(u)
      authReady.set(true)
      if (u) loadCollected(u.uid)
      else collected.set({})
    })
  })

  async function loadCollected(uid) {
    try {
      const snap = await get(ref(db, `users/${uid}/stamps`))
      collected.set(snap.exists() ? snap.val() : {})
    } catch (e) {
      console.error(e)
      collected.set({})
    }
  }
</script>

{#if !$authReady}
  <div class="splash">
    <div class="splash__inner">
      <div class="splash__mark">
        <SheepLogo size={88} />
      </div>
      <p class="splash__label">載入中…</p>
    </div>
  </div>
{:else if !$user}
  <Login />
{:else}
  <Header {count} total={ALL.length} user={$user} />

  <LineFilter lines={LINES} active={filter} onchange={(k) => (filter = k)} />

  <main class="shell">
    <section class="grid" aria-label="紀念章集章冊">
      {#each visible as station, i (station.id)}
        {@const record = $collected[station.id]}
        <StampCard {station} {record} {i} onclick={() => select(station.id)} />
      {/each}
    </section>
  </main>

  {#if selectedId}
    <StampDetail
      station={ALL.find((s) => s.id === selectedId)}
      record={$collected[selectedId]}
      onclose={() => (selectedId = null)} />
  {/if}

  <footer class="app-footer">
    印章圖源：台北捷運・新北捷運 · © Nasir 2026
  </footer>
{/if}
