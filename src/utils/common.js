import { ValidationError } from "./errors.js";

// This method will make dynamic placeholder for a sql query according to the columns.
export const getPlaceholders = (columns = []) => {
	if (Array.isArray(columns)) {
		if (columns.length) {
			return columns.map((_, i) => `$${i + 1}`).join(", ");
		}
	}

	throw new ValidationError("No columns found");
};
