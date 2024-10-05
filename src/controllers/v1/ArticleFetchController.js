import ArticleModel from "../../models/v1/ArticleModel.js";
import RSSFeedSourceModel from "../../models/v1/RSSFeedSourceModel.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { formatDate } from "../../utils/common.js";
import successResponseHandler from "../../utils/successResponseHandler.js";
import RSSParser from "rss-parser";
import { extractTopicsAndNamedEntities } from "../../utils/topicsExtraction.js";

const Article = new ArticleModel();

// Pull Articles from RSS Feed sources
export const fetchArticles = asyncHandler(async (req, res) => {
	const RSSFeedSource = new RSSFeedSourceModel();
	const RSSFeedSources = await RSSFeedSource.getAll();
	const parser = new RSSParser();

	const results = [];

	if (RSSFeedSources.length) {
		await Promise.all(
			RSSFeedSources.map(async (RSSFeed) => {
				try {
					const feed = await parser.parseURL(RSSFeed.url);

					const articles = await Promise.all(
						feed.items.map(async (item, i) => {
							// Extract topics and named entities
							const extraction = extractTopicsAndNamedEntities(
								item.contentSnippet || item.title
							);

							return [
								item.title,
								item.contentSnippet,
								formatDate(item.pubDate),
								item.link,
								JSON.stringify(extraction.topics),
								JSON.stringify(extraction.entities),
							];
						})
					);

					const result = await Article.bulkCreate(
						articles,
						"title,description,publication_date,source_url,topics,entities"
					);

					results.push({
						vendor: RSSFeed.vendor,
						articles: result.length,
					});
				} catch (error) {
					console.error(
						`Failed to fetch from ${RSSFeed.url}:`,
						error.message
					);

					// Continue processing other feeds even if one fails
					results.push({
						vendor: RSSFeed.vendor,
						articles: 0,
						error: error.message,
					});
				}
			})
		);
	}

	successResponseHandler(res, results, "Articles fetched successfully");
});
