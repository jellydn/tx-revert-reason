import {config} from 'dotenv';

import {getReasonByWeb3Js} from '../src';

config();

getReasonByWeb3Js(
  '0x901a505ab74c96686d086dc2ed1ae658d2b31485f4bdd610658177250a792b38',
)
  .then(reason => {
    console.log(reason);
  })
  .catch(error => {
    console.log(error);
  });
