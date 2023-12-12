<script lang="ts">
	import { onMount } from "svelte";

  export let mediaQuery: string

  let isScreenCurrentMatch = false

  function updateIsScreenCurrentMatch(e: MediaQueryListEvent) {
    isScreenCurrentMatch = e.matches
  }

  onMount(() => {
    const mediaWatcher = window.matchMedia(mediaQuery);
    isScreenCurrentMatch = mediaWatcher.matches

    if(mediaWatcher.addEventListener) {
      mediaWatcher.addEventListener("change", updateIsScreenCurrentMatch)

      return () => {
        mediaWatcher.removeEventListener("change", updateIsScreenCurrentMatch);
      }
    }else{
      mediaWatcher.addListener(updateIsScreenCurrentMatch)
      return () => {
        mediaWatcher.removeListener(updateIsScreenCurrentMatch)
      }
    }
  })

</script>

{#if isScreenCurrentMatch}
  <slot name="desktop"/>
  {:else}
    <slot name="mobile"/>
{/if}
