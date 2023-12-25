<script lang="ts">
	import '../styles/index.css';
	import { theme } from '$lib/stores/theme';
</script>

<svelte:head>
	<meta name="color-scheme" content={$theme} />
</svelte:head>

<slot />
