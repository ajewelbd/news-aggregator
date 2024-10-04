import express from "express";
import articleRoutes from "./articleRoutes.js";
import rssFeedRoutes from "./rssFeedRoutes.js";

const router = express.Router();

router.use("/articles", articleRoutes);
router.use("/rss-feed-sources", rssFeedRoutes);

export default router;
