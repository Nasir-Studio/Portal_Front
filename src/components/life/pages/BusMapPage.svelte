<script lang="ts">
  import Navbar from "@/components/Navbar.svelte";
  import BusMap from "@/components/BusMap.svelte";
</script>

<div class="h-screen flex flex-col bg-white">
  <Navbar />

  <main class="flex-1 relative">
    <BusMap />
  </main>
</div>
