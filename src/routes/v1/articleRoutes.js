import express from "express";
import {
	addNewArticle,
	deleteAArticle,
	getArticle,
	getArticles,
} from "../../controllers/v1/ArticleController.js";

const router = express.Router();

router.get("/", getArticles);
router.get("/:id", getArticle);
router.post("/", addNewArticle);
router.delete("/:id", deleteAArticle);

export default router;
