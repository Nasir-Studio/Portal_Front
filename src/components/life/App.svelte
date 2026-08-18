<script lang="ts">
  import type { Component } from "svelte";
  import Home from "./pages/Home.svelte";
  import TrashHome from "./pages/TrashHome.svelte";
  import Track from "./pages/Track.svelte";
  import Schedule from "./pages/Schedule.svelte";
  import BusHome from "./pages/BusHome.svelte";
  import BusSearchPage from "./pages/BusSearchPage.svelte";
  import BusMapPage from "./pages/BusMapPage.svelte";
  import BusPlanPage from "./pages/BusPlanPage.svelte";
  import PWARegister from "./components/PWARegister.svelte";
  import { getLocation } from "@/lib/router.svelte";

  const location = getLocation();

  const routes: { path: string; component: Component }[] = [
    { path: "/life/", component: Home },
    { path: "/life", component: Home },

    { path: "/life/trash/", component: TrashHome },
    { path: "/life/trash", component: TrashHome },

    { path: "/life/track/", component: Track },
    { path: "/life/track", component: Track },

    { path: "/life/schedule/", component: Schedule },
    { path: "/life/schedule", component: Schedule },

    { path: "/life/bus/", component: BusHome },
    { path: "/life/bus", component: BusHome },

    { path: "/life/bus/search/", component: BusSearchPage },
    { path: "/life/bus/search", component: BusSearchPage },

    { path: "/life/bus/map/", component: BusMapPage },
    { path: "/life/bus/map", component: BusMapPage },

    { path: "/life/bus/plan/", component: BusPlanPage },
    { path: "/life/bus/plan", component: BusPlanPage },

    { path: "/", component: Home },
    { path: "/trash/", component: TrashHome },
    { path: "/trash", component: TrashHome },
    { path: "/track/", component: Track },
    { path: "/track", component: Track },
    { path: "/schedule/", component: Schedule },
    { path: "/schedule", component: Schedule },
    { path: "/bus/", component: BusHome },
    { path: "/bus", component: BusHome },
    { path: "/bus/search/", component: BusSearchPage },
    { path: "/bus/search", component: BusSearchPage },
    { path: "/bus/map/", component: BusMapPage },
    { path: "/bus/map", component: BusMapPage },
    { path: "/bus/plan/", component: BusPlanPage },
    { path: "/bus/plan", component: BusPlanPage },
  ];

  let currentPath = $derived(location.state.pathname);
  let activeRoute = $derived(routes.find((r) => r.path === currentPath) ?? routes[0]);
</script>

<PWARegister />
{#if activeRoute}
  {@const Cmp = activeRoute.component}
  <Cmp />
{/if}