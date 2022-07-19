(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.snap = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";



















module.exports.onRpcRequest = async ({
  origin,
  request
}) => {
  console.log('omnid snap req', origin, request);

  switch (request.method) {
    case 'omnid_getTrustScoreData':
      {
        const resp = await fetch(`https://theconvo.space/api/identity?address=${request.address}&apikey=${request.apikey}`);
        const result = await resp.json();
        return result;
      }

    case 'omnid_getFortaData':
      {
        const customVariables = Boolean(request.customVariables) === true ? request.customVariables : {
          input: {
            addresses: [request.address.toLowerCase()]
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

    case 'omnid_notify':
      {
        return wallet.request({
          method: 'snap_notify',
          params: [{
            type: 'native',
            message: `Hello, ${origin}!`
          }]
        });
      }

    default:
      {
        throw new Error('Method not found.');
      }
  }
};

},{}]},{},[1])(1)
});