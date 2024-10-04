import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
	res.json({ info: `Welcome to ${process.env.APP_NAME || "app"}.` });
});

export default router;
