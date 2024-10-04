import express from "express";
import {
	addNewArticle,
	deleteAArticle,
	getArticle,
	getArticles,
} from "../../controllers/v1/ArticleController.js";
import { fetchArticles } from "../../controllers/v1/ArticleFetchController.js";

const router = express.Router();

router.get("/fetch", fetchArticles);
router.get("/", getArticles);
router.get("/:id", getArticle);
router.post("/", addNewArticle);
router.delete("/:id", deleteAArticle);

export default router;
