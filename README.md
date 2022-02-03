# MetaMask Snap for Omnid

Install & Explore : https://omnidsnap.vercel.app/

NPM: https://www.npmjs.com/package/@omnid/snap

Add to your Site:

```js
await ethereum.request({
    method: 'wallet_enable',
    params: [{
        wallet_snap: { [`npm:@omnid/snap`]: {} },
    }]
})
```
