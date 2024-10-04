import ArticleModel from "../../models/v1/ArticleModel.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { NotFoundError, ValidationError } from "../../utils/errors.js";
import successResponseHandler from "../../utils/successResponseHandler.js";

const Article = new ArticleModel();

// Get all Articles
export const getArticles = asyncHandler(async (req, res) => {
	const articles = await Article.getAll();
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
	const { vendor, url } = req.body;

	if (!vendor || !url) {
		throw new ValidationError();
	}

	const newArticle = await Article.create([vendor, url], "vendor,url");
	successResponseHandler(res, newArticle, "Article successfully created");
});

//Soft delete a Article
export const deleteAArticle = asyncHandler(async (req, res) => {
	const { id } = req.params;
	const deletedArticle = await Article.softDelete(id);
	successResponseHandler(res, deletedArticle, "Article successfully deleted");
});
