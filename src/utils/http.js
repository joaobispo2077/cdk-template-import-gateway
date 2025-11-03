exports.success = (x) => {
	const parsedResponse = parseResponse(x, 200);
	console.log('parsedResponse', parsedResponse);
	return parsedResponse;
};

exports.validationError = (x) => {
	const parsedResponse = parseResponse(x, 400);
	console.log('parsedResponse', parsedResponse);
	return parsedResponse;
};

exports.serverError = (x) => {
	const parsedResponse = parseResponse(x, 500);
	console.log('parsedResponse', parsedResponse);
	return parsedResponse;
};

const parseResponse = (x, defaultStatusCode) => {
	const defaultHeaders = {
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
		'Access-Control-Allow-Headers': 'Content-Type',
		'X-Frame-Options': 'SAMEORIGIN',
	};

	const body = x.body ? x.body : x;

	const response = {
		isBase64Encoded: x.isBase64Encoded ? x.isBase64Encoded : false,
		statusCode: x.statusCode ? x.statusCode : defaultStatusCode,
		headers: x.headers ? { ...defaultHeaders, ...x.headers } : defaultHeaders,
		body: typeof body === 'string' ? body : JSON.stringify(body),
	};

	return response;
};
