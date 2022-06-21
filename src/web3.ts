import process from 'node:process';
import logger from 'loglevel';
import Web3 from 'web3';

async function getResult(
  web3: Web3,
  {to, input, from, value, gas, gasPrice, blockNumber}: any,
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

export async function getReasonByWeb3Js(
  txHash: string,
  providerUrl = process.env?.ETH_PROVIDER_URL ?? '',
) {
  logger.info('tx hash:', txHash);
  logger.info('provider:', providerUrl);
  const web3 = new Web3(providerUrl);
  if (!/^0x([A-Fa-f\d]{64})$/.test(txHash)) {
    throw new Error(
      'Invalid transaction hash argument. Must be a 32 byte hex string with a 0x prefix which is 64 characters in total.',
    );
  }

  const receipt = await web3.eth.getTransactionReceipt(txHash);

  if (!receipt) {
    throw new Error(
      'Could not get transaction receipt. Are you sure it was mined?',
    );
  }

  if (receipt.status) {
    throw new Error(
      'Transaction did not fail. Can only read the revert reason from failed transactions',
    );
  }

  const transaction = await web3.eth.getTransaction(txHash);

  if (receipt.gasUsed === transaction.gas) {
    throw new Error('Transaction failed as it ran out of gas.');
  }

  let rawMessageData;
  try {
    const result = await getResult(web3, transaction);

    logger.info('RAW result:', result);
    // Trim the 0x prefix
    rawMessageData = result.slice(2);
  } catch (error: unknown) {
    if ((error as Error).message.startsWith('Node error: ')) {
      // Trim "Node error: "
      const errorObjectString = (error as Error).message.slice(12);
      // Parse the error object
      const errorObject = JSON.parse(errorObjectString);

      if (!errorObject.data) {
        throw new Error(
          `Failed to parse data field error object:${errorObjectString}`,
        );
      }

      if (errorObject.data.startsWith('Reverted 0x')) {
        // Trim "Reverted 0x" from the data field
        rawMessageData = errorObject.data.slice(11);
      } else if (errorObject.data.startsWith('0x')) {
        // Trim "0x" from the data field
        rawMessageData = errorObject.data.slice(2);
      } else {
        throw new Error(
          `Failed to parse data field error object:${errorObjectString}`,
        );
      }
    } else {
      return (error as Error).message;
    }
  }

  // Get the length of the revert reason
  const stringLength = Number.parseInt(
    rawMessageData.slice(8 + 64, 8 + 128),
    16,
  );
  // Using the length and known offset, extract and convert the revert reason
  const reasonCodeHex = rawMessageData.slice(
    8 + 128,
    8 + 128 + stringLength * 2,
  );
  // Convert reason from hex to string
  const reason = web3.utils.hexToAscii(`0x${reasonCodeHex}`);
  return reason;
}
