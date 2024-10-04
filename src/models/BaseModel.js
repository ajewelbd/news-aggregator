import { query } from "../config/db.js";
import { getPlaceholders } from "../utils/common.js";

class BaseModel {
	constructor(table = "", columns = "", hasSoftDelete = true) {
		this.table = table;
		this.columns = columns;
		this.hasSoftDelete = hasSoftDelete;
	}

	async getAll(columns = "") {
		columns = columns || this.columns;
		const sql = `SELECT ${columns} FROM ${this.table}${
			this.hasSoftDelete ? " WHERE deleted_at IS NULL" : ""
		}`;
		const { rows } = await query(sql);
		return rows;
	}

	async getById(id, columns = "") {
		columns = columns || this.columns;
		const sql = `SELECT ${columns} FROM ${this.table} WHERE id = $1${
			this.hasSoftDelete ? " AND deleted_at IS NULL" : ""
		}`;
		const { rows } = await query(sql, [id]);
		return rows[0];
	}

	async create(values, columns = "") {
		columns = columns || this.columns;
		const placeholder = getPlaceholders(columns.split(","));
		const sql = `INSERT INTO ${this.table} (${columns}) VALUES (${placeholder}) RETURNING *`;
		const { rows } = await query(sql, values);
		return rows[0];
	}

	async softDelete(id) {
		const sql = `UPDATE ${this.table} SET deleted_at = NOW() WHERE id = $1 RETURNING *`;
		const { rows } = await query(sql, [id]);
		return rows[0];
	}

	async remove(id) {
		const sql = `DELETE FROM ${this.table} WHERE id = $1 RETURNING *`;
		const { rows } = await query(sql, [id]);
		return rows[0];
	}
}

export default BaseModel;
