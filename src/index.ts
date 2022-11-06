import { OnRpcRequestHandler } from '@metamask/snap-types';
import { getInsights } from "./insights";
import { FortaDataParams, IsMaliciousParams, TrustScoreDataParams } from './types';

export const onRpcRequest: OnRpcRequestHandler = async ({ origin, request }) => {
  console.log('omnid snap req', origin, request);

  switch (request.method) {
    case 'omnid_getTrustScoreData': {
      let params: {[key:string]: any} = request.params ? request.params : {};
      let params2 = params as TrustScoreDataParams;
      const resp = await fetch(
        `https://theconvo.space/api/identity?address=${params2.address}&apikey=${params2.apikey}`,
      );
      const result = await resp.json();
      return result;
    }

    case 'omnid_isMalicious': {
      let params: {[key:string]: any} = request.params ? request.params : {};
      let params2 = params as IsMaliciousParams;
      const resp = await fetch(
        `https://theconvo.space/api/omnid/kits/isMalicious?addresses=["${params2.address}"]&apikey=${params2.apikey}`,
      );
      const result = await resp.json();
      return result;
    }

    case 'omnid_getFortaData': {
      let params: {[key:string]: any} = request.params ? request.params : {};
      let params2 = params as FortaDataParams;
      const customVariables =
        Boolean(params2.customVariables) === true
          ? params2.customVariables
          : {
              input: { addresses: [params2.address.toLowerCase()] },
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

    default: {
      throw new Error('Method not found.');
    }
  }
};

module.exports.onTransaction = getInsights;
