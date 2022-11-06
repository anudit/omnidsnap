import {
  OnTransactionHandler
} from '@metamask/snap-types';
import { KitsIsMaliciousResponse } from './types';

/**
   * Get transaction insights by looking at the transaction data
   * and attempting to decode it.
   *
   * @param transaction - The transaction to get insights for.
   * @returns The transaction insights.
   */
  export const getInsights: OnTransactionHandler = async ({chainId, transaction}) => {
    console.log('from Snap, transaction', transaction);

    try {

      if(transaction?.to){

        let data = await fetch(`https://theconvo.space/api/omnid/kits/isMalicious?addresses=[%22${transaction.to}%22]&apikey=CSCpPwHnkB3niBJiUjy92YGP6xVkVZbWfK8xriDO`, {
          method: "GET",
          headers: {
            'Connection': 'keep-alive',
            'Accept': '*/*'
          }
        });
        let resp: KitsIsMaliciousResponse = await data.json();

        console.log('from Snap, data', resp);

        if (resp?.results.length > 0){

          let insights: {[key: string]: string} = {}
          let data = resp?.results[0].value;

          for (let [key, val] of Object.entries(data)) {
            insights[key] = val === false ? '🟢 Looks Good' : JSON.stringify(val);
          }
          console.log('got Insights', insights)
          return {
            insights
          }

        }
        else {
          return {
            insights: {
              'No results': ''
            }
          }
        }

      }
      else {
        return {
          insights: {
            'No \'to\' in Transaction': ''
          }
        }
      }


    } catch (error) {
      console.error(error);
      return {
        insights: {
          'Error': JSON.stringify(error)
        }
      };
    }
  };
