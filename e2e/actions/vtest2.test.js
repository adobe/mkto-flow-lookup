const { Config } = require('@adobe/aio-sdk').Core
const fs = require('fs')
const fetch = require('node-fetch')

// get action url
const namespace = Config.get('runtime.namespace');
const hostname = Config.get('cna.hostname') || 'adobeioruntime.net';
const packagejson = JSON.parse(fs.readFileSync('package.json').toString());
const runtimePackage = `${packagejson.name}-${packagejson.version}`
const actionPrefix = `https://${namespace}.${hostname}/api/v1/web/${runtimePackage}`
const actionUrl = `${actionPrefix}/vtest2`;

describe('sample test to validate using statelib to store schemas', () => {
    test('', async ()=> {
        var result = await fetch(actionUrl, {headers:{"X-OW-EXTRA-LOGGING": "on"}})
        console.log(result);
        expect(await result.json()).toEqual(expect.objectContaining({success: true}))
    })
})