import {cli} from 'cleye';
import {config} from 'dotenv';
import logger from 'loglevel';

import {getReasonByEthersJs} from './ethers';
import {getReasonByWeb3Js} from './web3';

config();

// Parse argv
const argv = cli({
	name: 'tx-revert-reason',

	// Define parameters
	// Becomes available in ._.filePath
	parameters: [
		'<hash>', // Hash is required
	],

	// Define flags/options
	// Becomes available in .flags
	flags: {
		// Parses `--lib` as a string
		lib: {
			type: String,
			description: 'ethers or web3',
			default: 'ethers',
		},
	},
});

if (argv.flags.lib === 'ethers') {
	getReasonByEthersJs(argv._.hash).then(logger.info).catch(logger.error);
} else {
	getReasonByWeb3Js(argv._.hash).then(logger.info).catch(logger.error);
}
