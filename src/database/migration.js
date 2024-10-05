import { query } from "../config/db.js";

export const migration = async () => {
	// like title, description, publication date, and source URL.
	const sql = `
		CREATE TABLE IF NOT EXISTS rss_feed_sources (
			id SERIAL PRIMARY KEY,                  -- Auto-incrementing ID
			vendor VARCHAR(255) NOT NULL,           -- Published by (Ex: BBC, CNN), required field
			url VARCHAR(500) NOT NULL,              -- URL of the vendor, required field
			created_at TIMESTAMP DEFAULT NOW(),     -- Record creation timestamp (default to current time)
			updated_at TIMESTAMP DEFAULT NOW(),     -- Record update timestamp (default to current time)
			deleted_at TIMESTAMP                    -- Timestamp when the article was deleted (soft delete)
		);

		CREATE TABLE IF NOT EXISTS articles (
			id SERIAL PRIMARY KEY,                  -- Auto-incrementing ID
			title VARCHAR(255) NOT NULL,            -- Title of the article, required field
			description TEXT,                       -- Description of the article, required field
			publication_date DATE NOT NULL,         -- Date when the article was published
			source_url VARCHAR(500) NOT NULL,       -- URL of the article source, required field
			topics JSONB,       					-- Extracted article topics
			entities JSONB,       					-- Extracted article entities
			created_at TIMESTAMP DEFAULT NOW(),     -- Record creation timestamp (default to current time)
			updated_at TIMESTAMP DEFAULT NOW(),     -- Record update timestamp (default to current time)
			deleted_at TIMESTAMP                    -- Timestamp when the article was deleted (soft delete)
		);
	`;
	try {
		await query(sql);
		console.log("Migration sucessfull!");
	} catch (error) {
		console.log(`Migration failed!. Error:: ${error}`);
	}
};
