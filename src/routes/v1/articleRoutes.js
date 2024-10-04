import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
	res.json({ info: `Welcome to article` });
});

export default router;
