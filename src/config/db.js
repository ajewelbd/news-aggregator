import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();
const { Pool } = pkg;

const { DB_HOST, DB_USER, DB_PASS, DB_PORT, DB_NAME } = process.env;

// Create a connection pool at boot time
const pool = new Pool({
	user: DB_USER,
	host: DB_HOST,
	database: DB_NAME,
	password: DB_PASS,
	port: DB_PORT,
});

pool.on("connect", () => {
	console.log("New client connected to PostgreSQL");
});

pool.on("remove", () => {
	console.log("Client disconnected from PostgreSQL");
});

export const query = async (sql, data) => {
	try {
		const client = await pool.connect();
		return await client.query(sql, data);
	} catch (error) {
		throw new Error(error.message);
	}
};

export default pool;
