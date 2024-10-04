export const errorHandler = (error, req, res, next) => {
	const statusCode = error.statusCode || 500;
	const errorMessage = error.message || "Internal Server Error";

	return res.status(statusCode).json({
		status: "error",
		code: statusCode,
		message: errorMessage,
		stack: process.env.NODE_ENV === "production" ? null : error.stack, // Hide stack trace in production
	});
};
