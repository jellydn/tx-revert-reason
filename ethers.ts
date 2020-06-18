require("dotenv").config();
const ethers = require("ethers");
const logger = require("loglevel");
const provider = new ethers.providers.JsonRpcProvider(
	process.env.HTTP_PROVIDER_URL,
);

function hexToAscii(str: string) {
	const hex = str.toString();
	let result = "";
	for (let n = 0; n < hex.length; n += 2) {
		result += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
	}
	return result;
}

async function reason() {
	const [hash] = process.argv.slice(2);
	logger.log("tx hash:", hash);
	logger.log("provider:", process.env.HTTP_PROVIDER_URL);

	const tx = await provider.getTransaction(hash);
	if (tx) {
		const code = await provider.call(tx, tx.blockNumber);
		const reason = hexToAscii(code.substr(138));
		logger.log("revert reason:", reason);
	} else {
		logger.log("tx not found");
	}
}

reason();
