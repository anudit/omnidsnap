// const { Convo } = require('@theconvospace/sdk');

wallet.registerRpcMessageHandler(async (originString, requestObject) => {
  switch (requestObject.method) {
    case 'omnid_getTrustScoreData': {
      const resp = await fetch(
        `https://theconvo.space/api/identity?address=${requestObject.address}&apikey=${requestObject.apikey}`,
      );
      const result = await resp.json();
      return result;
    }

    case 'omnid_getFortaData': {
      const customVariables =
        Boolean(requestObject.customVariables) === true
          ? requestObject.customVariables
          : {
              input: { addresses: [requestObject.address.toLowerCase()] },
            };

      const resp = await fetch('https://api.forta.network/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `query getData($input: AlertsInput) {
            alerts(input: $input) {
               alerts {
                 createdAt
                 name
                 protocol
                 findingType
                 source {
                   transactionHash
                   block {
                     number
                     chainId
                   }
                   agent {
                     id
                   }
                 }
                 severity
                 metadata
               }
             }
           }`,
          variables: customVariables,
        }),
      });

      const result = await resp.json();
      return result;
    }

    case 'omnid_notify': {
      return wallet.request({
        method: 'snap_notify',
        params: [
          {
            type: 'native',
            message: `Hello, ${originString}!`,
          },
        ],
      });
    }

    // case 'omnid_getAdaptorData': {
    //    const convoinstance = new Convo(
    //     'CSCpPwHnkB3niBJiUjy92YGP6xVkVZbWfK8xriDO',
    //   );
    //   const adaptor = convoinstance.omnid.adaptors[requestObject.adaptor];
    //   const params = [requestObject.address];
    //   if ('config' in requestObject) {
    //     params.push(requestObject.config);
    //   }
    //   const result = await adaptor.apply(this, params);
    //   return result;
    // }

    default: {
      throw new Error('Method not found.');
    }
  }
});
