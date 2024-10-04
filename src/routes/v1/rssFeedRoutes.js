import express from "express";
import {
	addNewRSSFeedSource,
	deleteARSSFeedSource,
	getAllRSSFeedSource,
	getSingleRSSFeedSource,
} from "../../controllers/v1/RSSFeedsController.js";

const router = express.Router();

router.get("/", getAllRSSFeedSource);
router.get("/:id", getSingleRSSFeedSource);
router.post("/", addNewRSSFeedSource);
router.delete("/:id", deleteARSSFeedSource);

export default router;
