import data from '$lib/data/data.json';
import type { PageLoad } from './$types.js';

function getQuiz(subject: string) {
	const index = data.quizzes.findIndex(
		(d) => d.title.toLowerCase().trim() === subject.toLowerCase().trim()
	);
	return data.quizzes[index];
}

export const load: PageLoad = ({ params }) => {
	return getQuiz(params.subject);
};
