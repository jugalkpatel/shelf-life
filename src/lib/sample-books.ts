export type StarterBook = {
	id: string;
	openLibraryId: string;
	title: string;
	author: string;
	description: string;
	status?: 'to-read' | 'reading' | 'finished';
	rating?: number | null;
};

const searchableStarterBooks: StarterBook[] = [
	{
		id: 'station-eleven',
		openLibraryId: 'OL26431919M',
		title: 'Station Eleven',
		author: 'Emily St. John Mandel',
		description:
			'A traveling troupe keeps art, memory, and human connection alive after a devastating collapse.',
		status: 'reading',
		rating: 4
	},
	{
		id: 'piranesi',
		openLibraryId: 'OL27219525M',
		title: 'Piranesi',
		author: 'Susanna Clarke',
		description: 'An uncanny mystery set inside a vast house of tides, statues, and endless halls.',
		status: 'to-read',
		rating: null
	},
	{
		id: 'annihilation',
		openLibraryId: 'OL25416632M',
		title: 'Annihilation',
		author: 'Jeff VanderMeer',
		description:
			'A biologist joins a secretive expedition into a landscape that feels beautiful, hostile, and wrong.',
		status: 'finished',
		rating: 5
	}
];

export const featuredBooks: StarterBook[] = [
	{
		id: 'welcome-to-dead-house',
		openLibraryId: 'OL3282715M',
		title: 'Welcome to Dead House',
		author: 'R. L. Stine',
		description:
			'A family moves into a town where every house feels wrong and every neighbor seems just a little too friendly.',
		status: 'reading',
		rating: 4
	},
	{
		id: 'the-invasion',
		openLibraryId: 'OL24959144M',
		title: 'The Invasion',
		author: 'K. A. Applegate',
		description:
			'Five friends stumble into a secret alien war and learn that Earth has already been infiltrated.',
		status: 'to-read',
		rating: null
	},
	{
		id: 'the-sun-also-rises',
		openLibraryId: 'OL9274797M',
		title: 'The Sun Also Rises',
		author: 'Ernest Hemingway',
		description:
			'A restless circle of expatriates move from Paris to Pamplona in a novel about love, drift, and bravado.',
		status: 'finished',
		rating: 5
	}
];

export const searchStarterBooks = (query: string) => {
	const normalizedQuery = query.trim().toLowerCase();

	if (!normalizedQuery) {
		return searchableStarterBooks.slice();
	}

	return searchableStarterBooks.filter((book) => {
		return [book.title, book.author, book.openLibraryId].some((value) =>
			value.toLowerCase().includes(normalizedQuery)
		);
	});
};
