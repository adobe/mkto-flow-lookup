//const { Config } = require('@adobe/aio-sdk').Core
const fs = require('fs')
const fetch = require('node-fetch')
const {uploadUrl, actionPrefix} = require('../../../lib/constants');
const {mockSingleLead} = require('../../../test/mocks/mockAsyncRequest')

// get action url
// const namespace = Config.get('runtime.namespace');
// const hostname = Config.get('cna.hostname') || 'adobeioruntime.net';
// const packagejson = JSON.parse(fs.readFileSync('package.json').toString());
// const runtimePackage = `${packagejson.name}-${packagejson.version}`
// const actionPrefix = `https://${namespace}.${hostname}/api/v1/web/${runtimePackage}`
const actionUrl = `${actionPrefix}/executeCallback`;


describe('executeCallback e2e test', () => {
    var target = "country-codes.csv"
    var params = {
        "target": target,
        "file": "country,alpha-2,alpha-3,numeric\rZimbabwe,ZW,ZWE,716;"
    }
    test('exec w/ valid params', async () => {
        var ulRes = await fetch(uploadUrl, { method: "POST", body: JSON.stringify(params), headers: { 'Content-Type': 'application/json' } });
        var res = await fetch(actionUrl, {"headers": {"Content-Type": "application/json", "X-OW-EXTRA-LOGGING": "on"}, body: JSON.stringify(mockSingleLead), method: "POST"})
        // console.log(res);
        var json = await res.json();
        // console.log(json)
        expect(json.objectData[0].leadData).toEqual(expect.objectContaining({"country-code-2": "ZW", "id": 1000000}))
    })
})