import express from "express";
import {
	addNewRSSFeedSource,
	deleteARSSFeedSource,
	getRSSFeedSources,
	getRSSFeedSource,
} from "../../controllers/v1/RSSFeedsController.js";

const router = express.Router();

router.get("/", getRSSFeedSources);
router.get("/:id", getRSSFeedSource);
router.post("/", addNewRSSFeedSource);
router.delete("/:id", deleteARSSFeedSource);

export default router;
