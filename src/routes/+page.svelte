<script lang="ts">
	import Switch from '$lib/switch/Switch.svelte';
	import MatchMedia from '$lib/matchmedia/MatchMedia.svelte';
	import { getDatasViewSubject } from '$lib/util/utils.js';

	export let data;
</script>

<header>
	<Switch />
</header>
<main>
	<div class="content">
		<h1>
			Bem-vindo ao <span class="mark">teste de Frontend!</span>
		</h1>
		<p>Escolha um assunto para começar.</p>
	</div>
	<div class="list">
		{#each data.quizzes as subject}
			{@const dataViewSubject = getDatasViewSubject(subject.title)}
			<a
				href="/quiz/{dataViewSubject.subject}"
				target="_self"
				rel="next"
				title="Ir para o quiz de {dataViewSubject.subject}"
			>
				<div class="wrapperImage {dataViewSubject.class}">
					<MatchMedia mediaQuery="(min-width: 400px)">
						<svelte:component this={dataViewSubject.component} layout="mobile" slot="mobile" />
						<svelte:component this={dataViewSubject.component} layout="desktop" slot="desktop" />
					</MatchMedia>
				</div>
				<span class="text">
					{subject.title}
				</span>
			</a>
		{/each}
	</div>
</main>

<style>
	header {
		padding: 16px 24px;
	}

	main {
		padding: 32px 24px;
		margin: 0 0 117.39px 0;
	}

	h1 {
		font-size: 40px;
		font-weight: 300;
		line-height: 40px;
		color: var(--choise01);
		margin: 0 0 16px 0;
	}

	.mark {
		display: block;
		margin: 8px 0 0 0;
		font-weight: 500;
	}

	.content {
		margin: 0 0 40px 0;
	}

	p {
		font-size: 14px;
		font-style: italic;
		font-weight: 400;
		line-height: 21px;
		color: var(--grey-navy);
	}

	.wrapperImage {
		display: flex;
		flex-flow: row nowrap;
		align-items: center;
		justify-content: center;
		padding: 5.71px;
		border-radius: 10px;
	}

	.html {
		background-color: #fff1e9;
	}

	.css {
		background-color: #e0fdef;
	}

	.javascript {
		background-color: #ebf0ff;
	}
	.accessibility {
		background-color: #f6e7ff;
	}

	.text {
		font-size: 18px;
		font-weight: 500;
		line-height: 18px;
		color: var(--choise01);
	}

	a {
		display: flex;
		flex-flow: row nowrap;
		align-items: center;
		gap: 16px;
		padding: 12px;
		border-radius: 12px;
		background-color: var(--choose03);
		box-shadow: 0px 16px 40px 0px var(--shadow01);
		text-decoration: none;
	}

	a:not(:last-child) {
		margin: 0 0 12px 0;
	}
</style>
