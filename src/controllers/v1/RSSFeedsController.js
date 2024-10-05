import RSSFeedSourceModel from "../../models/v1/RSSFeedSourceModel.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { NotFoundError, ValidationError } from "../../utils/errors.js";
import successResponseHandler from "../../utils/successResponseHandler.js";

const RSSFeedSource = new RSSFeedSourceModel();

// Get all RSS Feed sources
export const getRSSFeedSources = asyncHandler(async (req, res) => {
	const RSSFeedSources = await RSSFeedSource.getAll();
	successResponseHandler(
		res,
		RSSFeedSources,
		"RSS Feed Sources retrieved successfully"
	);
});

// Get a single RSS Feed sources
export const getRSSFeedSource = asyncHandler(async (req, res) => {
	const { id } = req.params;
	const singleRSSFeedSource = await RSSFeedSource.getById(id);
	if (!singleRSSFeedSource) {
		throw new NotFoundError("RSS Feed Source not found");
	}

	successResponseHandler(
		res,
		singleRSSFeedSource,
		"RSS Feed Source retrieved successfully"
	);
});

// Add a new RSS Feed source
export const addNewRSSFeedSource = asyncHandler(async (req, res) => {
	const { vendor, url } = req.body;

	if (!vendor || !url) {
		throw new ValidationError();
	}

	const newRSSFeedSource = await RSSFeedSource.create(
		[vendor, url],
		"vendor,url"
	);
	successResponseHandler(
		res,
		newRSSFeedSource,
		"RSS Feed Source successfully created"
	);
});

//Soft delete a RSS Feed source
export const deleteARSSFeedSource = asyncHandler(async (req, res) => {
	const { id } = req.params;
	const deletedRSSFeedSource = await RSSFeedSource.softDelete(id);
	successResponseHandler(
		res,
		deletedRSSFeedSource,
		"RSS Feed Source successfully deleted"
	);
});
