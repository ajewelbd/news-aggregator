import fs from "fs";
import { ValidationError } from "./errors.js";

// Function to make dynamic placeholder for a sql query according to the columns.
export const getPlaceholders = (columns = [], values = []) => {
	// Ensure columns are provided
	if (!Array.isArray(columns) || !columns.length) {
		throw new ValidationError("No columns found");
	}

	// If there are values, we need to generate placeholders for each row (bulk insert)
	if (Array.isArray(values) && values.length) {
		const totalColumns = columns.length;

		return values
			.map((value, rowIndex) => {
				// For each row, we create placeholders for each column
				return value
					.map((_, columnIndex) => {
						// Generate placeholders, where each value gets a unique index
						return `$${rowIndex * totalColumns + columnIndex + 1}`;
					})
					.join(", ");
			})
			.map((row) => `(${row})`)
			.join(", ");
	}

	// In case of no values, we generate placeholders for the columns alone
	return columns.map((_, i) => `$${i + 1}`).join(", ");
};

// Function to format the date as YYYY-MM-DD
export const formatDate = (pubDate) => {
	try {
		const date = new Date(pubDate);
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based, so we add 1
		const day = String(date.getDate()).padStart(2, "0"); // Pad single digits with 0
		return `${year}-${month}-${day}`;
	} catch (e) {
		return "";
	}
};

export const readJsonFileSync = (filePath) => {
	try {
		const data = fs.readFileSync(filePath, "utf-8"); // Read file synchronously
		const jsonData = JSON.parse(data); // Parse JSON data
		return jsonData;
	} catch (error) {
		console.error("Error reading JSON file:", error);
		return null;
	}
};
