import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import router from "./src/controller/router.js";

dotenv.config(); // Load environment variable

const app = express();
app.use(express.json());
app.use(cors()); // To apply cross-site accessibility

app.use("/", router);

app.use("*", (_, res) => {
	res.status(404).json({ info: "Endpoint not found" });
});

const HOST = process.env.HOST || "localhost";
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on http://${HOST}:${PORT}`));
