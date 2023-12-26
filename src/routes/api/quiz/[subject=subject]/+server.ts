import data from '$lib/data/data.json';
import { json } from '@sveltejs/kit';

export function GET({ params }) {
	const index = data.quizzes.findIndex(
		(d) => d.title.toLowerCase().trim() === params.subject.toLocaleLowerCase().trim()
	);
	return json(data.quizzes[index]);
}
