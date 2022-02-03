wallet.registerRpcMessageHandler(async (originString, requestObject) => {
  switch (requestObject.method) {
    case 'omnid_getTrustScoreData': {
      const resp = await fetch(
        `https://theconvo.space/api/identity?address=${requestObject.address}&apikey=${requestObject.apikey}`,
      );
      const result = await resp.json();
      return result;
    }
    default:
      throw new Error('Method not found.');
  }
});
