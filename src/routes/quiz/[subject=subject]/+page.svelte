<script lang="ts">
	import Switch from '$lib/switch/Switch.svelte';
	import { alphabet, getDatasViewSubject } from '$lib/util/utils.js';
	import MatchMedia from '$lib/matchmedia/MatchMedia.svelte';
	import ProgressBar from '$lib/progressbar/ProgressBar.svelte';
	import Error from '$lib/icons/Error.svelte';
	import CheckMark from '$lib/icons/CheckMark.svelte';
	import { page } from '$app/stores';

	export let data;

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
</script>

<section>
	<header>
		<div class="headerContainer">
			<span class="icon {datasRendering.class}">
				<MatchMedia mediaQuery="(min-width: 400px)">
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
									<MatchMedia mediaQuery="(min-width: 400px)">
										<svelte:component this={CheckMark} slot="mobile" />
										<svelte:component this={CheckMark} size={40} slot="desktop" />
									</MatchMedia>
								{:else if typeof idxOptionSelected === 'number' && typeof idxResponse === 'number' && idxOptionSelected !== idxResponse && idxOptionSelected === i && isSubmitResponse}
									<MatchMedia mediaQuery="(min-width: 400px)">
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
					class:spacing={isNoResponseSelected}
					>{isSubmitResponse && idxQuestion < data.questions.length - 1
						? 'Próxima Questão'
						: isSubmitResponse && idxQuestion === data.questions.length - 1
						  ? 'Ver Pontuação'
						  : 'Enviar Resposta'}</button
				>
				{#if isNoResponseSelected && isSubmiteResponseWithoutOptionSelected}
					<p role="alert" class="error">
						<MatchMedia mediaQuery="(min-width: 400px)">
							<svelte:component this={Error} slot="mobile" />
							<svelte:component this={Error} size={40} slot="desktop" />
						</MatchMedia>
						<span class="errorText"> Selecione uma resposta </span>
					</p>
				{/if}
			</div>
		{:else}
			<div class="scored">
				<h2 class="scoredTitle">
					Questionário concluído
					<span class="scoredTitleColor">Você pontuou...</span>
				</h2>
				<div>
					<div class="scoredContainer">
						<div class="scoredContainerQuiz">
							<span class="icon {datasRendering.class}">
								<MatchMedia mediaQuery="(min-width: 400px)">
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
			</div>
		{/if}
	</main>
</section>

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
	.quizBtnResponse {
		display: flex;
		flex-flow: row nowrap;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 56px;
		border-radius: 12px;
		background-color: var(--purple);
		box-shadow: 0px 16px 40px 0px rgba(--shadow01);
		font-size: 18px;
		font-weight: 500;
		line-height: 18px;
		color: var(--pure-white);
	}

	.scoredContainerBtn:is(:hover, :focus),
	.quizBtnResponse:is(:hover, :focus) {
		background: linear-gradient(0deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.5) 100%),
			var(--purple);
	}

	.scoredContainerBtn {
		text-decoration: none;
	}

	.spacing {
		margin: 0 0 12px 0;
	}

	.error {
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
		align-self: flex-end;
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
</style>