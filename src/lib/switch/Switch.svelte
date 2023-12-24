<script lang="ts">
	import Moon from '$lib/icons/Moon.svelte';
	import Sunny from '$lib/icons/Sunny.svelte';
	import { theme } from '$lib/stores/theme';

	function toggleStatus(
		e:
			| (MouseEvent & {
					currentTarget: EventTarget & HTMLDivElement;
			  })
			| (KeyboardEvent & {
					currentTarget: EventTarget & HTMLDivElement;
			  })
	) {
		const checked = e.currentTarget.getAttribute('aria-checked') === 'true' ? true : false;
		theme.update(() => (checked ? 'light' : 'dark'));
		e.currentTarget.setAttribute('aria-checked', checked ? 'false' : 'true');
	}

	function handleClick(
		e: MouseEvent & {
			currentTarget: EventTarget & HTMLDivElement;
		}
	) {
		toggleStatus(e);
	}

	function handleKeydown(
		e: KeyboardEvent & {
			currentTarget: EventTarget & HTMLDivElement;
		}
	) {
		if (e.key === 'Enter' || e.key === '') {
			toggleStatus(e);
		}
	}
</script>

<div class="container">
	<span class="icon {$theme === 'light' ? 'light' : 'dark'}">
		<Sunny />
	</span>
	<div
		role="switch"
		aria-checked={$theme === 'light' ? 'false' : 'true'}
		on:click={(e) => handleClick(e)}
		on:keydown={(e) => handleKeydown(e)}
		tabindex={0}
		title="Alternar tema cores"
		aria-label="Alternar tema cores"
		class="switch"
	>
		<span class="controller"></span>
	</div>
	<span class="icon {$theme === 'light' ? 'light' : 'dark'}">
		<Moon />
	</span>
</div>

<style>
	.switch {
		background-color: var(--purple);
		width: 32px;
		padding: 4px;
		height: 20px;
		border-radius: 999px;
		transition: all 0.3s ease-in-out;
		position: relative;
		content: '';
	}

	.controller {
		display: block;
		width: 12px;
		height: 12px;
		content: '';
		border-radius: 50%;
		background-color: var(--pure-white);
		position: absolute;
		top: 4px;
		left: 4px;
		transition: all 0.35s ease;
	}

	.switch[aria-checked='false'] .controller {
		left: 4px;
	}

	.switch[aria-checked='true'] .controller {
		left: 16px;
	}

	.icon {
		display: flex;
		align-items: center;
		color: #626c7f;
	}

	.light {
		color: var(--grey-navy);
		fill: var(--grey-navy);
	}

	.dark {
		color: var(--pure-white);
		fill: var(--pure-white);
	}

	.container {
		display: flex;
		flex-flow: row nowrap;
		align-items: center;
		justify-content: flex-end;
		gap: 8px;
	}
</style>
