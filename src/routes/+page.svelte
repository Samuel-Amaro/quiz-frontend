<script lang="ts">
	import Switch from '$lib/switch/Switch.svelte';
	import MatchMedia from '$lib/matchmedia/MatchMedia.svelte';
	import { getDatasViewSubject } from '$lib/util/utils.js';
	import type { Quizzes } from '../types/api.type';

	async function getQuizzes() {
		await new Promise((resolve) => setTimeout(resolve, 2000));
		const response = await fetch('/api/quizzes');
		const quizzes: Quizzes = await response.json();
		return quizzes.quizzes;
	}
</script>

<svelte:head>
	<title>Quiz Front-End</title>
	<meta
		name="description"
		content="Teste sobre assuntos relacionados a área de desenvolvimento Front-End"
	/>
	<meta
		property="og:description"
		content="Teste sobre assuntos relacionados a área de desenvolvimento Front-End"
	/>
	<meta property="og:title" content="Quiz Front-End" />
</svelte:head>

<header>
	<Switch />
</header>
<main>
	<div class="content">
		<h1>
			Bem-vindo ao <span class="mark">teste de Frontend!</span>
		</h1>
		<p class="contentDescription">Escolha um assunto para começar.</p>
	</div>
	{#await getQuizzes()}
		<p class="messageLoad">Carregando Questionários...</p>
	{:then quizzes}
		<div class="list">
			{#each quizzes as subject}
				{@const dataViewSubject = getDatasViewSubject(subject.title)}
				<a
					href="/quiz/{dataViewSubject.subject}"
					target="_self"
					rel="next"
					title="Ir para o quiz de {dataViewSubject.subject}"
				>
					<div class="wrapperImage {dataViewSubject.class}">
						<MatchMedia mediaQuery="(min-width: 600px)">
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
	{:catch error}
		<p class="messageError">Houve um erro ao carregar dados dos questionários...</p>
	{/await}
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
		display: flex;
		flex-flow: column nowrap;
		align-items: flex-start;
		justify-content: center;
		gap: 8px;
	}

	.mark {
		display: block;
		font-weight: 500;
	}

	.content {
		margin: 0 0 40px 0;
	}

	.contentDescription,
	.messageLoad,
	.messageError {
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

	@media screen and (min-width: 600px) {
		header {
			padding: 54px 64px 64px 64px;
		}

		main {
			padding: 0px 64px 32px 64px;
			margin: 0 0 208.01px 0;
		}

		h1 {
			font-size: 64px;
			line-height: 64px;
			margin: 0 0 16px 0;
		}

		.mark {
			display: block;
			font-weight: 500;
		}

		.contentDescription,
		.messageLoad,
		.messageError {
			font-size: 20px;
			line-height: 30px;
		}

		.content {
			margin: 0 0 64px 0;
		}

		a {
			gap: 32px;
			border-radius: 24px;
		}

		.wrapperImage {
			padding: 8px;
			border-radius: 12px;
		}

		.text {
			font-size: 28px;
			line-height: 28px;
		}

		a:not(:last-child) {
			margin: 0 0 24px 0;
		}
	}

	@media screen and (min-width: 1200px) {
		header {
			padding: 97px 0 99px 0;
			max-width: 1160px;
			margin: 0 auto;
		}

		main {
			padding: 0px 24px 0 24px;
			margin: 0 0 280.01px 0;
			display: grid;
			grid-template-columns: minmax(min-content, 465px) minmax(min-content, 564px);
			justify-content: center;
			gap: 131px;
		}

		h1 {
			margin: 0 0 48px 0;
		}

		.content {
			margin: 0;
		}

		a {
			padding: 20px;
		}
	}
</style>
