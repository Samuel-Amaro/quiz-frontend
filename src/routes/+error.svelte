<script lang="ts">
	import { page } from '$app/stores';
</script>

<main>
	<div>
		<h1>{$page.status} {$page.error?.message}</h1>
		<p>desculpe, ocorreu um erro.</p>
		<a href="/" target="_self" rel="next">Voltar Para Home</a>
	</div>
</main>

<style>
	main {
		height: 100vh;
		display: flex;
		flex-flow: row nowrap;
		align-items: center;
		justify-content: center;
	}

	div {
		padding: 32px;
		border-radius: 12px;
		background-color: var(--choose03);
		margin: 0 12px;
	}

	h1 {
		font-size: 40px;
		font-weight: 700;
		line-height: 40px;
		color: var(--choise01);
	}

	p {
		font-size: 20px;
		font-weight: 400;
		line-height: 30px;
		color: var(--choise01);
		margin: 0 0 16px 0;
	}

	a {
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
		text-decoration: none;
	}

	a:is(:hover, :focus) {
		background: linear-gradient(0deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.5) 100%),
			var(--purple);
	}
</style>
