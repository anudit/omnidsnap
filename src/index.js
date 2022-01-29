var fetch = require('node-fetch');

wallet.registerRpcMessageHandler(async (originString, requestObject) => {
  switch (requestObject.method) {
    case 'omnid_getTrustScoreData':
      const accounts = await wallet.request({ method: 'eth_requestAccounts' });
      const resp = await fetch(
        `https://theconvo.space/api/identity?address=${accounts[0]}&apikey=CONVO`,
      );
      const result = await resp.json();
      return result;
    default:
      throw new Error('Method not found.');
  }
});
