const { generateUUID } = require('./uuid');

function generateTransactionId(transactionID = null) {
	if (transactionID) {
		console.log(`Transaction ID already exists: ${transactionID}`);
		return transactionID;
	}

	const newTransactionID = generateUUID();
	console.log(`New Transaction ID: ${newTransactionID}`);
	return newTransactionID;
}

module.exports = {
	generateTransactionId,
};
