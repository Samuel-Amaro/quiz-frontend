<script lang="ts">
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
		e.currentTarget.setAttribute("aria-checked", checked ? 'false' : 'true');
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

<div
	role="switch"
	aria-checked={$theme === "light" ? "false" : "true"}
	on:click={(e) => handleClick(e)}
	on:keydown={(e) => handleKeydown(e)}
	tabindex={0}
	title="Alternar tema cores"
	aria-label="Alternar tema cores"
  class="switch"
>
	<span class="controller"></span>
</div>

<style>
  div{
    background-color: var(--purple);
    width: 32px;
    padding: 4px;
    height: 20px;
    border-radius: 999px;
    transition: all 0.3s ease-in-out;
    position: relative;
		content: "";
  }

  span{
    display: block;
    width: 12px;
    height: 12px;
    content: "";
    border-radius: 50%;
    background-color: var(--pure-white);
    position: absolute;
		top: 4px;
		left: 4px;
		transition: all 0.35s ease;
  }

  div[aria-checked="false"] span{
    left: 4px;
  }

  div[aria-checked="true"] span{
    left: 16px;
  }
</style>
