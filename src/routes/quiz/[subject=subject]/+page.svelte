<script lang="ts">
	import Switch from '$lib/switch/Switch.svelte';
	import { alphabet, getDatasViewSubject } from '$lib/util/utils.js';
	import MatchMedia from '$lib/matchmedia/MatchMedia.svelte';
	import ProgressBar from '$lib/progressbar/ProgressBar.svelte';
	import Error from '$lib/icons/Error.svelte';
	import CheckMark from '$lib/icons/CheckMark.svelte';
	import { page } from '$app/stores';
	import type { Quiz } from '../../../types/api.type.js';
	import type { PageData } from './$types.js';

	export let data: PageData;

	let idxQuestion = 0;
	let points: number = 0;
	let idxOptionSelected: number | null = null;
	let isSubmitResponse = false;
	let isSubmiteResponseWithoutOptionSelected = false;
	let isShowScore = false;

	$: datasRendering = getDatasViewSubject(data.title);
	$: question = data.questions[idxQuestion];
	$: idxResponse = question.options.findIndex(
		(option) => option.toLowerCase() === question.answer.toLowerCase()
	);
	$: isResponseCorrect =
		typeof idxOptionSelected === 'number' ? idxOptionSelected === idxResponse : false;
	$: isNoResponseSelected = idxOptionSelected === null ? true : false;

	function nextQuestion() {
		if (idxQuestion < data.questions.length - 1) {
			if (isResponseCorrect) {
				points = points + 1;
			}

			idxQuestion = idxQuestion + 1;
		} else if (idxQuestion === data.questions.length - 1) {
			if (isResponseCorrect) {
				points = points + 1;
			}
			isShowScore = true;
		}

		isSubmitResponse = false;
		idxOptionSelected = null;
		isSubmiteResponseWithoutOptionSelected = false;
	}

	function handleBtnSubmitResponse() {
		if (!isNoResponseSelected) {
			isSubmitResponse = true;
			return;
		}
		isSubmiteResponseWithoutOptionSelected = true;
	}

	function handleBtnOption(idx: number) {
		idxOptionSelected = idx;
	}

	async function getQuiz() {
		await new Promise((resolve) => setTimeout(resolve, 2000));
		const response = await fetch(`/api/quiz/${$page.params.subject}`);
		const quiz: Quiz = await response.json();
		return quiz;
	}
</script>

<svelte:head>
	<title>Teste sobre {data.title}</title>
	<meta property="og:title" content={`Teste sobre {data.title}`} />
</svelte:head>

{#await getQuiz()}
	<div class="load">
		<h1 class="loadTitle">Carrregando quiz {$page.params.subject.toUpperCase()}...</h1>
	</div>
{:then quiz}
	<section>
		<header>
			<div class="headerContainer">
				<span class="icon {datasRendering.class}">
					<MatchMedia mediaQuery="(min-width: 600px)">
						<svelte:component this={datasRendering.component} layout="mobile" slot="mobile" />
						<svelte:component this={datasRendering.component} layout="desktop" slot="desktop" />
					</MatchMedia>
				</span>
				<h1>{data.title}</h1>
			</div>
			<Switch />
		</header>
		<main>
			{#if !isShowScore}
				<div class="content">
					<p class="contentControllerQuestions">
						Pergunta {idxQuestion + 1} de {data.questions.length}
					</p>
					<h2 class="contentTitle">{question.question}</h2>
					<ProgressBar min={0} max={data.questions.length} value={idxQuestion + 1} />
				</div>
				<div class="quiz">
					<div class="quizListOptions">
						{#each question.options as option, i}
							<button
								type="button"
								on:click={() => handleBtnOption(i)}
								on:keydown={(e) => {
									if (e.key === 'Enter' || e.key === '') handleBtnOption(i);
								}}
								title={option}
								aria-label={`Opção: ${option}`}
								class="quizOption"
								class:optionCorrect={typeof idxResponse === 'number' &&
								typeof idxOptionSelected === 'number' &&
								idxResponse === idxOptionSelected &&
								idxOptionSelected === i &&
								isSubmitResponse
									? true
									: false}
								class:optionActive={typeof idxOptionSelected === 'number' &&
								idxOptionSelected === i &&
								!isSubmitResponse
									? true
									: false}
								class:optionIncorrect={typeof idxOptionSelected === 'number' &&
								typeof idxResponse === 'number' &&
								idxOptionSelected !== idxResponse &&
								idxOptionSelected === i &&
								isSubmitResponse
									? true
									: false}
								disabled={isSubmitResponse}
							>
								<div class="quizOptionWrapper">
									<span class="quizOrderOption">
										<h3 class="quizTitle">{alphabet[i]}</h3>
									</span>
									<span class="quizContentOption">{option}</span>
								</div>
								<span class="quizOptionIcon">
									{#if typeof idxResponse === 'number' && typeof idxOptionSelected === 'number' && idxResponse === i && isSubmitResponse}
										<MatchMedia mediaQuery="(min-width: 600px)">
											<svelte:component this={CheckMark} slot="mobile" />
											<svelte:component this={CheckMark} size={40} slot="desktop" />
										</MatchMedia>
									{:else if typeof idxOptionSelected === 'number' && typeof idxResponse === 'number' && idxOptionSelected !== idxResponse && idxOptionSelected === i && isSubmitResponse}
										<MatchMedia mediaQuery="(min-width: 600px)">
											<svelte:component this={Error} slot="mobile" />
											<svelte:component this={Error} size={40} slot="desktop" />
										</MatchMedia>
									{/if}
								</span>
							</button>
						{/each}
					</div>
					<button
						type="button"
						title="Enviar resposta"
						aria-label="Enviar resposta"
						on:click={() => {
							if (
								isSubmitResponse &&
								!isNoResponseSelected &&
								idxQuestion <= data.questions.length - 1
							) {
								nextQuestion();
							} else if (!isSubmitResponse && !isNoResponseSelected) {
								handleBtnSubmitResponse();
							} else {
								handleBtnSubmitResponse();
							}
						}}
						on:keydown={(e) => {
							if (e.key === 'Enter' || e.key === '') {
								if (
									isSubmitResponse &&
									!isNoResponseSelected &&
									idxQuestion <= data.questions.length - 1
								) {
									nextQuestion();
								} else if (!isSubmitResponse && !isNoResponseSelected) {
									handleBtnSubmitResponse();
								} else {
									handleBtnSubmitResponse();
								}
							}
						}}
						class="quizBtnResponse"
						class:spacing={isNoResponseSelected && isSubmiteResponseWithoutOptionSelected}
						>{isSubmitResponse && idxQuestion < data.questions.length - 1
							? 'Próxima Questão'
							: isSubmitResponse && idxQuestion === data.questions.length - 1
							  ? 'Ver Pontuação'
							  : 'Enviar Resposta'}</button
					>
					{#if isNoResponseSelected && isSubmiteResponseWithoutOptionSelected}
						<p role="alert" class="errorWarning">
							<MatchMedia mediaQuery="(min-width: 600px)">
								<svelte:component this={Error} slot="mobile" />
								<svelte:component this={Error} size={40} slot="desktop" />
							</MatchMedia>
							<span class="errorText"> Selecione uma resposta </span>
						</p>
					{/if}
				</div>
			{:else}
				<h2 class="scoredTitle">
					Questionário concluído
					<span class="scoredTitleColor">Você pontuou...</span>
				</h2>
				<div>
					<div class="scoredContainer">
						<div class="scoredContainerQuiz">
							<span class="icon {datasRendering.class}">
								<MatchMedia mediaQuery="(min-width: 600px)">
									<svelte:component this={datasRendering.component} layout="mobile" slot="mobile" />
									<svelte:component
										this={datasRendering.component}
										layout="desktop"
										slot="desktop"
									/>
								</MatchMedia>
							</span>
							<h3 class="scoredContainerTitle">{data.title}</h3>
						</div>
						<h4 class="scoredContainerPoints">{points}</h4>
						<h5 class="scoredContainerFrom">de {data.questions.length}</h5>
					</div>
					<a
						href={$page.url.href}
						target="_self"
						rel="next"
						title="Jogar de novo"
						aria-label="Jogar de novo"
						class="scoredContainerBtn"
					>
						Jogar de novo
					</a>
				</div>
			{/if}
		</main>
	</section>
{:catch}
	<div class="error">
		<h1 class="errorTitle">Houve um erro ao carregar dados dos quiz</h1>
		<a
			class="errorLink"
			href="/"
			target="_self"
			rel="next"
			title="Voltar para home"
			aria-label="Voltar para home">Voltar para home</a
		>
	</div>
{/await}

<style>
	section {
		padding: 16px 24px 151.6px 24px;
	}

	header {
		padding: 0 0 16px 0;
		display: flex;
		flex-flow: row wrap;
		align-items: center;
		justify-content: space-between;
	}

	.icon {
		display: flex;
		flex-flow: row nowrap;
		align-items: center;
		justify-content: center;
		padding: 5px;
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

	h1,
	.scoredContainerTitle {
		color: var(--choise01);
		font-size: 18px;
		font-weight: 500;
		line-height: 18px;
		margin: 0;
	}

	.headerContainer {
		display: flex;
		align-items: center;
		gap: 16px;
	}

	main {
		padding: 32px 0 0 0;
	}

	.content {
		margin: 0 0 40px 0;
	}

	.contentControllerQuestions {
		font-size: 14px;
		font-style: italic;
		font-weight: 400;
		line-height: 21px;
		color: var(--choise02);
		margin: 0 0 12px 0;
	}

	.contentTitle {
		font-size: 20px;
		font-weight: 500;
		line-height: 24px;
		color: var(--choise01);
		margin: 0 0 24px 0;
	}

	.quizListOptions {
		margin: 0 0 12px 0;
	}

	.quizOption:not(:last-child) {
		margin: 0 0 12px 0;
	}

	.quizBtnResponse,
	.quizOption {
		appearance: none;
		border: none;
		font-family: inherit;
		box-sizing: border-box;
		cursor: pointer;
	}

	.quizOption {
		display: flex;
		flex-flow: row nowrap;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		padding: 9px 12px;
		width: 100%;
		border-radius: 12px;
		background-color: var(--choose03);
		box-shadow: 0px 16px 40px 0px var(--shadow01);
		border: 3px solid transparent;
	}

	.quizOrderOption {
		display: flex;
		flex-flow: row nowrap;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		flex-shrink: 0;
		border-radius: 12px;
		background-color: var(--light-grey);
	}

	.quizOption:is(:hover, :focus) .quizOrderOption {
		background-color: #f6e7ff;
	}

	.quizTitle {
		font-size: 18px;
		font-weight: 500;
		line-height: 18px;
		text-align: center;
		color: var(--grey-navy);
	}

	.quizOption:is(:hover, :focus) .quizTitle {
		color: var(--purple);
	}

	.quizContentOption {
		font-size: 18px;
		font-weight: 500;
		line-height: 18px;
		color: var(--choise01);
	}

	.scoredContainerBtn,
	.quizBtnResponse,
	.errorLink {
		display: flex;
		flex-flow: row nowrap;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 56px;
		border-radius: 12px;
		background-color: var(--purple);
		box-shadow: 0px 16px 40px 0px var(--shadow01);
		font-size: 18px;
		font-weight: 500;
		line-height: 18px;
		color: var(--pure-white);
	}

	.scoredContainerBtn:is(:hover, :focus),
	.quizBtnResponse:is(:hover, :focus),
	.errorLink:is(:hover, :focus) {
		background: linear-gradient(0deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.5) 100%),
			var(--purple);
	}

	.scoredContainerBtn {
		text-decoration: none;
	}

	.spacing {
		margin: 0 0 12px 0;
	}

	.errorWarning {
		display: flex;
		flex-flow: row nowrap;
		align-items: center;
		justify-content: center;
		gap: 8px;
	}

	.errorText {
		font-size: 18px;
		font-weight: 400;
		line-height: 18px;
		color: var(--choose04);
	}

	.optionCorrect {
		border-color: var(--green);
	}

	.optionCorrect .quizOrderOption {
		background-color: var(--green);
	}

	.optionCorrect .quizTitle {
		color: var(--pure-white);
	}

	.optionActive {
		border-color: var(--purple);
	}

	.optionActive .quizOrderOption {
		background-color: var(--purple);
	}

	.optionActive .quizTitle {
		color: var(--pure-white);
	}

	.quizOptionIcon {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.quizOptionWrapper {
		display: flex;
		flex-flow: row nowrap;
		align-items: center;
		gap: 16px;
	}

	.optionIncorrect {
		border-color: var(--red);
	}

	.optionIncorrect .quizOrderOption {
		background-color: var(--red);
	}

	.optionIncorrect .quizTitle {
		color: var(--pure-white);
	}

	.scoredTitle {
		font-size: 40px;
		font-weight: 300;
		line-height: 40px;
		display: flex;
		flex-flow: column nowrap;
		gap: 8px;
		color: var(--choise01);
		margin: 0 0 40px 0;
	}

	.scoredTitleColor {
		display: block;
		font-weight: 500;
	}

	.scoredContainer {
		background-color: var(--choose03);
		padding: 32px;
		border-radius: 12px;
		box-shadow: 0px 16px 40px 0px var(--shadow01);
		margin: 0 0 12px 0;
	}

	.scoredContainerQuiz {
		display: flex;
		flex-flow: row nowrap;
		align-items: center;
		justify-content: center;
		gap: 16px;
		margin: 0 0 16px 0;
	}

	.scoredContainerPoints {
		font-size: 88px;
		font-weight: 500;
		line-height: 88px;
		text-align: center;
		color: var(--choise01);
		margin: 0 0 16px 0;
	}

	.scoredContainerFrom {
		font-size: 18px;
		font-weight: 400;
		line-height: 18px;
		color: var(--choise02);
		text-align: center;
	}

	.load,
	.error {
		height: 100vh;
		display: flex;
		flex-flow: row nowrap;
		align-items: center;
		justify-content: center;
	}

	.loadTitle,
	.errorTitle {
		padding: 24px;
		border-radius: 12px;
		background-color: var(--choose03);
		color: var(--choise01);
		font-weight: 700;
		font-size: 24px;
		line-height: 24px;
	}

	.errorTitle {
		color: var(--choose04);
	}

	.errorLink {
		text-decoration: none;
	}

	@media screen and (min-width: 600px) {
		section {
			padding: 40px 64px 151.6px 64px;
		}

		header {
			padding: 0 0 49px 0;
		}

		main {
			padding: 0;
		}

		.icon {
			padding: 8px;
			border-radius: 12px;
		}

		h1,
		.scoredContainerTitle {
			font-size: 28px;
			line-height: 28px;
		}

		.headerContainer {
			gap: 24px;
		}

		.contentControllerQuestions {
			font-size: 20px;
			line-height: 30px;
			margin: 0 0 27px 0;
		}

		.contentTitle {
			font-size: 36px;
			line-height: 43.2px;
			margin: 0 0 40px 0;
		}

		.content {
			margin: 0 0 64px 0;
		}

		.quizOption {
			gap: 32px;
			padding: 12px;
			border-radius: 24px;
		}

		.quizOptionWrapper {
			gap: 32px;
		}

		.quizTitle {
			font-size: 28px;
			line-height: 28px;
		}

		.quizOrderOption {
			width: 56px;
			height: 56px;
		}

		.quizContentOption {
			font-size: 28px;
			line-height: 28px;
		}

		.quizOption:not(:last-child) {
			margin: 0 0 24px 0;
		}

		.quizListOptions {
			margin: 0 0 32px 0;
		}

		.scoredContainerBtn,
		.quizBtnResponse,
		.errorLink {
			height: 92px;
			border-radius: 24px;
			font-size: 28px;
			line-height: 28px;
		}

		.errorText {
			font-size: 24px;
			line-height: 36px;
		}

		.spacing {
			margin: 0 0 32px 0;
		}

		.scoredTitle {
			font-size: 64px;
			line-height: 64px;
			margin: 0 0 64px 0;
		}

		.scoredContainer {
			padding: 48px;
			border-radius: 24px;
			margin: 0 0 32px 0;
		}

		.scoredContainerQuiz {
			gap: 24px;
			margin: 0 0 40px 0;
		}

		.scoredContainerPoints {
			font-size: 144px;
			line-height: 144px;
		}

		.scoredContainerFrom {
			font-size: 24px;
			line-height: 36px;
		}
	}

	@media screen and (min-width: 1200px) {
		section {
			padding: 83px 0 151.6px 0;
			max-width: 1160px;
			margin: 0 auto;
		}

		header {
			padding: 0 0 85px 0;
		}

		main {
			display: grid;
			grid-template-columns: minmax(min-content, 465px) minmax(min-content, 565px);
			gap: 131px;
		}

		.contentTitle {
			margin: 0 0 164px 0;
		}

		.content {
			margin: 0;
		}

		.quizOption {
			padding: 18px 20px;
		}

		.scoredTitle {
			margin: 0;
		}
	}
</style>
