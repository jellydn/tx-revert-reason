import {config} from 'dotenv';

import {getReasonByWeb3Js} from '../src';

config();

getReasonByWeb3Js(
	'0x35403cfc33cababac41ad998dff9038c57945ac7cbe9f22e5bdfbf89a8756bd7',
	'https://data-seed-prebsc-1-s1.binance.org:8545',
)
	.then(reason => {
		console.log(reason);
	})
	.catch(error => {
		console.log(error);
	});
