const fetch = require('node-fetch');

wallet.registerRpcMessageHandler(async (originString, requestObject) => {
  switch (requestObject.method) {
    case 'omnid_getTrustScoreData': {
      const accounts = await wallet.request({ method: 'eth_requestAccounts' });
      const resp = await fetch(
        `https://theconvo.space/api/identity?address=${accounts[0]}&apikey=CONVO`,
      );
      const result = await resp.json();
      return result;
    }

    case 'omnid_default': {
      // Just this case works
      const accounts = await wallet.request({ method: 'eth_requestAccounts' });
      return {
        account: accounts[0],
        scoreData: 50,
      };
    }
    default:
      throw new Error('Method not found.');
  }
});
