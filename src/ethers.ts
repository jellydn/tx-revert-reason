import process from 'node:process';
import {providers} from 'ethers';
import logger from 'loglevel';

function hexToAscii(string_: string) {
  const hex = string_.toString();
  let result = '';
  for (let n = 0; n < hex.length; n += 2) {
    result += String.fromCodePoint(Number.parseInt(hex.slice(n, n + 2), 16));
  }

  return result;
}

export async function getReasonByEthersJs(hash: string) {
  logger.info('tx hash:', hash);
  logger.info('provider:', process.env.HTTP_ETH_PROVIDER_URL);
  const provider = new providers.JsonRpcProvider(
    process.env?.ETH_PROVIDER_URL ?? '',
  );
  const tx = await provider.getTransaction(hash);
  if (tx) {
    const code = await provider.call(tx as any, tx.blockNumber);
    const reason = hexToAscii(code.slice(138));
    return reason;
  }

  throw new Error('tx not found');
}
