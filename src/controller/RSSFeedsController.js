import {
	createRSSFeedSource,
	deleteRSSFeedSource,
	getRSSFeedSourceById,
	getRSSFeedSources,
} from "../models/v1/RSSFeedSourceModel.js";
import asyncHandler from "../utils/asyncHandler.js";
import { NotFoundError, ValidationError } from "../utils/errors.js";
import successResponseHandler from "../utils/successResponseHandler.js";

// Get all RSS Feed sources
export const getAllRSSFeedSource = asyncHandler(async (req, res) => {
	const RSSFeedSources = await getRSSFeedSources();
	successResponseHandler(
		res,
		RSSFeedSources,
		"RSS Feed Sources retrieved successfully"
	);
});

// Get a single RSS Feed sources
export const getSingleRSSFeedSource = asyncHandler(async (req, res) => {
	const { id } = req.params;
	const RSSFeedSource = await getRSSFeedSourceById(id);
	if (!RSSFeedSource) {
		throw new NotFoundError("RSS Feed Source not found");
	}

	successResponseHandler(
		res,
		RSSFeedSource,
		"RSS Feed Source retrieved successfully"
	);
});

// Add a new RSS Feed source
export const addNewRSSFeedSource = asyncHandler(async (req, res) => {
	const { vendor, url } = req.body;

	if (!vendor || !url) {
		throw new ValidationError();
	}

	const newRSSFeedSource = await createRSSFeedSource(vendor, url);
	successResponseHandler(
		res,
		newRSSFeedSource,
		"RSS Feed Source successfully created"
	);
});

// Add a new RSS Feed source
export const deleteARSSFeedSource = asyncHandler(async (req, res) => {
	const { id } = req.params;
	const deletedRSSFeedSource = await deleteRSSFeedSource(id);
	successResponseHandler(
		res,
		deletedRSSFeedSource,
		"RSS Feed Source successfully deleted"
	);
});
