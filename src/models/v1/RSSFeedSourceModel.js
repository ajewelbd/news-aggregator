import BaseModel from "../BaseModel.js";

class RSSFeedSourceModel extends BaseModel {
	constructor() {
		super(
			"rss_feed_sources",
			"id,vendor,url,created_at,updated_at,deleted_at"
		);
	}
}

export default RSSFeedSourceModel;
