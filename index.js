import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import pool from "./src/config/db.js";
import routes from "./src/routes/v1/index.js";
import { errorHandler } from "./src/middleware/errorHandler.js";

// Load environment variable
dotenv.config();

// Middleware to parse JSON requests
const app = express();

app.use(express.json());
app.use(cors()); // To apply cross-site accessibility

const API_VERSION = process.env.API_VERSION;

app.get("/", (_, res) => {
	res.json({ message: `Welcome to ${process.env.APP_NAME || "app"}.` });
});

app.use(`/api/${API_VERSION}`, routes);

// Catch all undefined routes and return 404
app.use("*", (_, res) => {
	res.status(404).json({ status: "error", message: "Route not found" });
});

// Global error handler
app.use(errorHandler);

const HOST = process.env.HOST || "localhost";
const PORT = process.env.PORT || 3000;

app.listen(PORT, HOST, async () => {
	try {
		// Verify connection pool works
		const client = await pool.connect();
		console.log("Database connection stablished");
		client.release();
		console.log(`Server running on http://${HOST}:${PORT}`);
	} catch (error) {
		console.error("Error connecting to the database:", error);
		process.exit(1); // Exit if there’s a connection error
	}
});
