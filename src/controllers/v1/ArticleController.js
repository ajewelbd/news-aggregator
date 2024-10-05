import ArticleModel from "../../models/v1/ArticleModel.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { NotFoundError, ValidationError } from "../../utils/errors.js";
import successResponseHandler from "../../utils/successResponseHandler.js";

const Article = new ArticleModel();

// Get all Articles
export const getArticles = asyncHandler(async (req, res) => {
	const { publication_date, search } = req.query;

	let articles = [];

	if (publication_date || search) {
		let condition = "";
		if (publication_date)
			condition = `publication_date='${publication_date}'`;

		if (search) {
			if (condition) condition += " AND ";
			condition += `topics @> '["${search}"]' OR entities @> '["${search}"]'`;
		}

		articles = await Article.filter("", condition);
	} else {
		articles = await Article.getAll();
	}
	successResponseHandler(res, articles, "Articles retrieved successfully");
});

// Get a single Article
export const getArticle = asyncHandler(async (req, res) => {
	const { id } = req.params;
	const article = await Article.getById(id);
	if (!article) {
		throw new NotFoundError("Article not found");
	}

	successResponseHandler(res, article, "Article retrieved successfully");
});

// Add a new Article
export const addNewArticle = asyncHandler(async (req, res) => {
	const {
		title,
		description,
		publication_date,
		source_url,
		topics,
		entities,
	} = req.body;

	if (!title || !publication_date || !source_url) {
		throw new ValidationError();
	}

	if (topics && !Array.isArray(topics)) {
		throw new ValidationError("Topics must be an array");
	}

	if (entities && !Array.isArray(entities)) {
		throw new ValidationError("Entities must be an array");
	}

	const newArticle = await Article.create(
		[
			title,
			description || "",
			publication_date,
			source_url,
			JSON.stringify(topics || []),
			JSON.stringify(entities || []),
		],
		"title,description,publication_date,source_url,topics,entities"
	);
	successResponseHandler(res, newArticle, "Article successfully created");
});

//Soft delete a Article
export const deleteAArticle = asyncHandler(async (req, res) => {
	const { id } = req.params;
	const deletedArticle = await Article.softDelete(id);
	successResponseHandler(res, deletedArticle, "Article successfully deleted");
});
