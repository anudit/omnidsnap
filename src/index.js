// wallet.onMetaMaskEvent('newUnapprovedTx', async (txMeta) => {
//   console.log('newUnapprovedTx', txMeta);
//   const { txParams } = txMeta;
//   const addressIsUntrustworthy = true;
//   wallet.addAddressAudit({
//     address: txParams.to,
//     auditor: 'Awesome Audits',
//     status: addressIsUntrustworthy ? 'warning' : 'approval',
//     message: addressIsUntrustworthy
//       ? 'The recipient of this transaction is untrustworthy'
//       : 'The recipient of this transaction is trustworthy',
//   });
// });

// wallet.onMetaMaskEvent('tx:status-update', (id, status) => {
//   const currentPluginState = wallet.getPluginState();
//   const txMeta = wallet.getTxById(id);

//   console.log('tx:status-update', id, status, currentPluginState, txMeta);
// });

module.exports.onRpcRequest = async ({ origin, request }) => {
  console.log('omnid snap req', origin, request);

  switch (request.method) {
    case 'omnid_getTrustScoreData': {
      const resp = await fetch(
        `https://theconvo.space/api/identity?address=${request.address}&apikey=${request.apikey}`,
      );
      const result = await resp.json();
      return result;
    }

    case 'omnid_getFortaData': {
      const customVariables =
        Boolean(request.customVariables) === true
          ? request.customVariables
          : {
              input: { addresses: [request.address.toLowerCase()] },
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
            message: `Hello, ${origin}!`,
          },
        ],
      });
    }

    default: {
      throw new Error('Method not found.');
    }
  }
};

module.exports.onTransaction = ({ origin, transaction, chainId }) => ({
  origin,
  transaction,
  chainId,
});
