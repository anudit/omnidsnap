(function (f) {
  if (typeof exports === "object" && typeof module !== "undefined") {
    module.exports = f();
  } else if (typeof define === "function" && define.amd) {
    define([], f);
  } else {
    var g;
    if (typeof window !== "undefined") {
      g = window;
    } else if (typeof global !== "undefined") {
      g = global;
    } else if (typeof self !== "undefined") {
      g = self;
    } else {
      g = this;
    }
    g.snap = f();
  }
})(function () {
  var define, module, exports;
  return function () {
    function r(e, n, t) {
      function o(i, f) {
        if (!n[i]) {
          if (!e[i]) {
            var c = "function" == typeof require && require;
            if (!f && c) return c(i, !0);
            if (u) return u(i, !0);
            var a = new Error("Cannot find module '" + i + "'");
            throw a.code = "MODULE_NOT_FOUND", a;
          }
          var p = n[i] = {
            exports: {}
          };
          e[i][0].call(p.exports, function (r) {
            var n = e[i][1][r];
            return o(n || r);
          }, p, p.exports, r, e, n, t);
        }
        return n[i].exports;
      }
      for (var u = "function" == typeof require && require, i = 0; i < t.length; i++) o(t[i]);
      return o;
    }
    return r;
  }()({
    1: [function (require, module, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.onRpcRequest = void 0;
      var _insights = require("./insights");
      const onRpcRequest = async ({
        origin,
        request
      }) => {
        console.log('omnid snap req', origin, request);
        switch (request.method) {
          case 'omnid_getTrustScoreData':
            {
              let params = request.params ? request.params : {};
              let params2 = params;
              const resp = await fetch(`https://theconvo.space/api/identity?address=${params2.address}&apikey=${params2.apikey}`);
              const result = await resp.json();
              return result;
            }
          case 'omnid_isMalicious':
            {
              let params = request.params ? request.params : {};
              let params2 = params;
              const resp = await fetch(`https://theconvo.space/api/omnid/kits/isMalicious?addresses=["${params2.address}"]&apikey=${params2.apikey}`);
              const result = await resp.json();
              return result;
            }
          case 'omnid_getFortaData':
            {
              let params = request.params ? request.params : {};
              let params2 = params;
              const customVariables = Boolean(params2.customVariables) === true ? params2.customVariables : {
                input: {
                  addresses: [params2.address.toLowerCase()]
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
          default:
            {
              throw new Error('Method not found.');
            }
        }
      };
      exports.onRpcRequest = onRpcRequest;
      module.exports.onTransaction = _insights.getInsights;
    }, {
      "./insights": 2
    }],
    2: [function (require, module, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.getInsights = void 0;
      const getInsights = async ({
        chainId,
        transaction
      }) => {
        console.log('from Snap, transaction', transaction);
        try {
          if (transaction !== null && transaction !== void 0 && transaction.to) {
            let data = await fetch(`https://theconvo.space/api/omnid/kits/isMalicious?addresses=[%22${transaction.to}%22]&apikey=CSCpPwHnkB3niBJiUjy92YGP6xVkVZbWfK8xriDO`, {
              method: "GET",
              headers: {
                'Connection': 'keep-alive',
                'Accept': '*/*'
              }
            });
            let resp = await data.json();
            console.log('from Snap, data', resp);
            if ((resp === null || resp === void 0 ? void 0 : resp.results.length) > 0) {
              let insights = {};
              let data = resp === null || resp === void 0 ? void 0 : resp.results[0].value;
              for (let [key, val] of Object.entries(data)) {
                insights[key] = val === false ? '🟢 Looks Good' : JSON.stringify(val);
              }
              console.log('got Insights', insights);
              return {
                insights
              };
            } else {
              return {
                insights: {
                  'No results': ''
                }
              };
            }
          } else {
            return {
              insights: {
                'No \'to\' in Transaction': ''
              }
            };
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
      exports.getInsights = getInsights;
    }, {}]
  }, {}, [1])(1);
});