<script lang="ts">
  import { navigate, normalizePath } from "@/lib/router.svelte";

  let { to, class: className = "", children }: { to: string; class?: string; children?: import("svelte").Snippet } = $props();

  let targetPath = $derived(normalizePath(to));

  function onClick(e: MouseEvent) {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    navigate(to);
  }
</script>

<a href={targetPath} class={className} onclick={onClick}>{@render children?.()}</a>