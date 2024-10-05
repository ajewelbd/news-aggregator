import lda from "lda";
import nlp from "compromise";

// This function uses named entity recognition (NER) to find important entities (e.g., places, people)
export const extractNamedEntities = (text) => {
	const doc = nlp(text);

	// Extract people
	const people = doc.people().out("array");

	// Extract places
	const places = doc.places().out("array");

	// Extract organizations
	const organizations = doc.organizations().out("array");

	return [...people, ...places, ...organizations];
};

// Extract topics from the given text using lda.
export const extractTopics = (text) => {
	try {
		let topics = lda([text], 1, 5);
		topics = topics.length ? topics[0].map(({ term }) => term) : [];

		return topics;
	} catch (e) {
		return [];
	}
};

// Extract topics from the given text using lda.
export const extractTopicsAndNamedEntities = (text) => {
	try {
		const topics = extractTopics(text);
		const entities = extractNamedEntities(text);

		return { topics, entities };
	} catch (e) {
		console.log(e);
		return { topics: [], entites: [] };
	}
};
