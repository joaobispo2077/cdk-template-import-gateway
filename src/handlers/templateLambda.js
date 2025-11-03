require('source-map-support').install();
/* eslint-disable no-unused-vars */
('use strict');
const http = require('../utils/http');
const fetch = require('node-fetch');
const { generateTransactionId } = require('../utils/transactionID.js');
const DEBUG_MODE = process.env.DEBUG_MODE === 'true';

const DOWNSTREAM_URL = process.env.DOWNSTREAM_URL;

/**
 * Sends request to rbox https://rbox.app/
 * @param event
 * @param context
 * @returns {Promise<unknown>}
 */
module.exports.handler = async (event, _context) => {
	const transactionID = generateTransactionId(
		event?.headers?.['Transaction-ID'],
	);
	try {
		if (!event?.headers) {
			event.headers = {};
		}

		if (!event?.headers?.['Transaction-ID']) {
			event.headers['Transaction-ID'] = transactionID;
		}
		const REQUEST_PARAMS = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Transaction-ID': event.headers['Transaction-ID'],
			},
			body: JSON.stringify(event.body),
		};

		console.log('Sending request to DOWNSTREAM:', {
			url: DOWNSTREAM_URL,
			method: REQUEST_PARAMS.method,
			headers: REQUEST_PARAMS.headers,
		});

		if (DEBUG_MODE) {
			console.log('Tokenizer request with payload:', REQUEST_PARAMS);
		}

		const response = await fetch(DOWNSTREAM_URL, REQUEST_PARAMS);
		const dataBody = await response.json();
		const handlerResponse = {
			statusCode: 200,
			body: {
				...dataBody,
				'AC-Transaction-ID': transactionID,
			},
			headers: {
				'AC-Transaction-ID': transactionID,
			},
		};

		console.log(
			`Returning response to caller: ${JSON.stringify(handlerResponse)}`,
		);

		return http.success(handlerResponse);
	} catch (error) {
		console.log(error);

		const errorResponse = http.serverError({
			statusCode: error.code ? error.code : 500,
			body: {
				message:
					error.code && error.message ? error.message : 'Internal Server Error',
				'AC-Transaction-ID': transactionID,
			},
			headers: {
				'AC-Transaction-ID': transactionID,
			},
		});

		return errorResponse;
	}
};
