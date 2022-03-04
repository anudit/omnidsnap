(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

// const { Convo } = require('@theconvospace/sdk');
wallet.registerRpcMessageHandler(async (originString, requestObject) => {
  switch (requestObject.method) {
    case 'omnid_getTrustScoreData':
      {
        const resp = await fetch(`https://theconvo.space/api/identity?address=${requestObject.address}&apikey=${requestObject.apikey}`);
        const result = await resp.json();
        return result;
      }

    case 'omnid_getFortaData':
      {
        const customVariables = Boolean(requestObject.customVariables) === true ? requestObject.customVariables : {
          input: {
            addresses: [requestObject.address.toLowerCase()]
          }
        };
        const resp = await fetch('https://api.forta.network/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
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
            variables: customVariables
          })
        });
        const result = await resp.json();
        return result;
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

    default:
      {
        throw new Error('Method not found.');
      }
  }
});

},{}]},{},[1]);