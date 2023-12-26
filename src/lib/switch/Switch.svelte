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
		content: '';
		display: flex;
		flex-flow: column nowrap;
		justify-content: center;
	}

	.controller {
		display: block;
		width: 12px;
		height: 12px;
		content: '';
		border-radius: 50%;
		background-color: var(--pure-white);
		transition: all 0.35s ease;
		position: relative;
	}

	.switch[aria-checked='false'] .controller {
		left: 0px;
	}

	.switch[aria-checked='true'] .controller {
		left: 12px;
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

	@media screen and (min-width: 600px) {
		.container {
			gap: 16px;
		}

		.switch {
			width: 48px;
			height: 28px;
		}

		.controller {
			width: 20px;
			height: 20px;
		}

		.switch[aria-checked='false'] .controller {
			left: 0px;
		}

		.switch[aria-checked='true'] .controller {
			left: 20px;
		}
	}
</style>
