import BaseModel from "../BaseModel.js";

class ArticleModel extends BaseModel {
	constructor() {
		super(
			"articles",
			"id,title,description,publication_date,source_url,created_at,updated_at,deleted_at"
		);
	}
}

export default ArticleModel;
