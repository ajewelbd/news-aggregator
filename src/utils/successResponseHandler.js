const successResponseHandler = (
	res,
	data,
	message = "Success",
	statusCode = 200
) => {
	res.status(statusCode).json({
		status: "success",
		code: statusCode,
		message,
		data,
	});
};

export default successResponseHandler;
