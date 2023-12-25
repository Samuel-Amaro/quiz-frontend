import data from '$lib/data/data.json';

export const prerender = true;

export function load() {
	return data;
}
