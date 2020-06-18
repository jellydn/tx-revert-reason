require("dotenv").config();
const Web3 = require("web3");
const logger = require("loglevel");

const web3 = new Web3(process.env.HTTP_PROVIDER_URL);

async function getResult(
	{
		to,
		input,
		from,
		value,
		gas,
		gasPrice,
		blockNumber,
	},
) {
	// Geth call to get result
	return web3.eth.call(
		{
			to,
			data: input,
			from,
			value,
			gas,
			gasPrice,
		},
		blockNumber,
	);
}

async function main() {
	const [txHash] = process.argv.slice(2);
	logger.log("tx hash:", txHash);
	logger.log("provider:", process.env.HTTP_PROVIDER_URL);

	if (!txHash.match(/^0x([A-Fa-f0-9]{64})$/)) {
		logger.error(
			"Invalid transaction hash argument. Must be a 32 byte hex string with a 0x prefix which is 64 characters in total.",
		);
		process.exit(2);
	}

	const receipt = await web3.eth.getTransactionReceipt(txHash);

	if (!receipt) {
		logger.error(
			"Could not get transaction receipt. Are you sure it was mined?",
		);
		process.exit(3);
	}

	if (receipt.status) {
		logger.error(
			"Transaction did not fail. Can only read the revert reason from failed transactions",
		);
		process.exit(3);
	}

	const transaction = await web3.eth.getTransaction(txHash);

	if (receipt.gasUsed === transaction.gas) {
		logger.error("Transaction failed as it ran out of gas.");
		process.exit(4);
	}

	let rawMessageData;
	try {
		const result = await getResult(transaction);

		logger.log("RAW result:", result);
		// Trim the 0x prefix
		rawMessageData = result.slice(2);
	} catch (e) {
		logger.log("RAW error message:", e.message);

		if (e.message.startsWith("Node error: ")) {
			// Trim "Node error: "
			const errorObjectStr = e.message.slice(12);
			// Parse the error object
			const errorObject = JSON.parse(errorObjectStr);

			if (!errorObject.data) {
				throw Error(`Failed to parse data field error object:${errorObjectStr}`);
			}

			if (errorObject.data.startsWith("Reverted 0x")) {
				// Trim "Reverted 0x" from the data field
				rawMessageData = errorObject.data.slice(11);
			} else if (errorObject.data.startsWith("0x")) {
				// Trim "0x" from the data field
				rawMessageData = errorObject.data.slice(2);
			} else {
				throw Error(`Failed to parse data field error object:${errorObjectStr}`);
			}
		} else {
			throw Error(
				`Failed to parse error message from Ethereum call: ${e.message}`,
			);
		}
	}

	// Get the length of the revert reason
	const strLen = parseInt(rawMessageData.slice(8 + 64, 8 + 128), 16);
	// Using the length and known offset, extract and convert the revert reason
	const reasonCodeHex = rawMessageData.slice(8 + 128, 8 + 128 + strLen * 2);
	// Convert reason from hex to string
	const reason = web3.utils.hexToAscii(`0x${reasonCodeHex}`);
	logger.log("revert reason:", reason);
}

main();
