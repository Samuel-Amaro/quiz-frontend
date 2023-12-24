import type { ParamMatcher } from '@sveltejs/kit';

function matchSubject(subject: string) {
	switch (subject.toLowerCase()) {
		case 'html':
			return true;
		case 'css':
			return true;
		case 'javascript':
			return true;
		case 'accessibility':
			return true;
	}
	return false;
}

export const match: ParamMatcher = (param) => {
	return matchSubject(param);
};
