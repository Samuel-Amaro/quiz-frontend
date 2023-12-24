import Html from '$lib/icons/Html.svelte';
import Css from '$lib/icons/Css.svelte';
import Javascript from '$lib/icons/Javascript.svelte';
import Acessibility from '$lib/icons/Acessibility.svelte';

export function getDatasViewSubject(subject: string) {
	const datasViewSubject = [
		{
			subject: 'html',
			class: 'html',
			component: Html
		},
		{
			subject: 'css',
			class: 'css',
			component: Css
		},
		{
			subject: 'javascript',
			class: 'javascript',
			component: Javascript
		},
		{
			subject: 'accessibility',
			class: 'accessibility',
			component: Acessibility
		}
	];
	const index = datasViewSubject.findIndex((data) => data.subject === subject.toLowerCase());
	return datasViewSubject[index];
}

export const alphabet = [
	'A',
	'B',
	'C',
	'D',
	'E',
	'F',
	'G',
	'H',
	'I',
	'J',
	'K',
	'L',
	'M',
	'N',
	'O',
	'P',
	'Q',
	'R',
	'S',
	'T',
	'U',
	'V',
	'W',
	'X',
	'Y',
	'Z'
];
