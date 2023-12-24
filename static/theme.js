const themeSaved = localStorage.getItem('theme');

if (themeSaved) {
	document.body.setAttribute('data-theme', themeSaved);
} else {
	const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
	const theme = prefersLight ? 'light' : 'dark';
	document.body.setAttribute('data-theme', theme);
	localStorage.setItem('theme', theme);
}
