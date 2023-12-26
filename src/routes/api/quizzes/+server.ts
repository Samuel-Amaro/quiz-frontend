import { json } from '@sveltejs/kit';
import data from '$lib/data/data.json';

export function GET() {
	return json(data);
}
