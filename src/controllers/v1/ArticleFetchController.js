import ArticleModel from "../../models/v1/ArticleModel.js";
import RSSFeedSourceModel from "../../models/v1/RSSFeedSourceModel.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { formatDate } from "../../utils/common.js";
import { NotFoundError, ValidationError } from "../../utils/errors.js";
import successResponseHandler from "../../utils/successResponseHandler.js";
import RSSParser from "rss-parser";

const Article = new ArticleModel();

// Pull Articles from RSS Feed sources
export const fetchArticles = asyncHandler(async (req, res) => {
	const RSSFeedSource = new RSSFeedSourceModel();
	const RSSFeedSources = await RSSFeedSource.getAll();
	const parser = new RSSParser();

	if (RSSFeedSources.length) {
		for (const RSSFeed of RSSFeedSources) {
			const feed = await parser.parseURL(RSSFeed.url);

			const articles = feed.items.map((item) => {
				return [
					item.title,
					item.contentSnippet,
					formatDate(item.pubDate),
					item.link,
				];
			});

			const result = Article.bulkCreate(
				articles,
				"title,description,publication_date,source_url"
			);

			console.log(result.rows);
		}
	}

	// const articles = await Article.getAll();
	successResponseHandler(res, [], "Articles retrieved successfully");
});
