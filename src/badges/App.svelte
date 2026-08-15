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
    <div class="splash__mark">
      <SheepLogo size={88} />
    </div>
    <p class="splash__label">【雙北捷運】捷運章集戳</p>
    <p class="splash__sub">TAIPEI & NEW TAIPEI METRO BADGE</p>
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
    <div class="app-footer__inner">
      <span>羊家入口網</span>
      <span class="app-footer__sep" aria-hidden="true">｜</span>
      <span>印章圖源：台北捷運・新北捷運</span>
      <span class="app-footer__sep" aria-hidden="true">｜</span>
      <span>© Nasir 2026</span>
    </div>
  </footer>
{/if}

<style>
  .splash {
    min-height: 100dvh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
    background: #f5f4f1;
  }

  .splash__mark {
    width: 88px;
    margin-bottom: 0.6rem;
    line-height: 0;
    animation: swing 1.5s ease-in-out infinite;
  }

  @keyframes swing {
    0%,
    100% {
      transform: rotate(-10deg);
    }
    50% {
      transform: rotate(10deg);
    }
  }

  .splash__label {
    font-family: 'Noto Serif TC', 'Songti TC', serif;
    font-size: 2.2rem;
    font-weight: 700;
    letter-spacing: 0.2em;
    color: #1c1c1c;
    margin-top: 0.2rem;
    animation: splash-in 0.6s ease-out both;
  }

  .splash__sub {
    margin-top: 0.7rem;
    font-family: 'Noto Sans TC', 'PingFang TC', system-ui, sans-serif;
    font-size: 0.68rem;
    font-weight: 400;
    letter-spacing: 0.5em;
    text-transform: uppercase;
    color: #4c4b47;
    animation: splash-in 0.6s ease-out 0.15s both;
  }

  @keyframes splash-in {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .app-footer {
    border-top: 1px solid #d8d7d2;
    background: #f5f4f1;
  }

  .app-footer__inner {
    max-width: 1080px;
    margin: 0 auto;
    padding: 2rem 1.25rem 2.4rem;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    text-align: center;
    font-family: 'Noto Sans TC', 'PingFang TC', system-ui, sans-serif;
    font-size: 0.8rem;
    letter-spacing: 0.08em;
    color: #8b8983;
  }

  .app-footer__sep {
    color: #b9b8b2;
  }
</style>
