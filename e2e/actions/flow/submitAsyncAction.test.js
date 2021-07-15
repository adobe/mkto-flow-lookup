const Config = require('@adobe/aio-lib-core-config')
const fs = require('fs')
const fetch = require('node-fetch')
const { uploadUrl } = require('../../constants');
const { mockSingleLead } = require("../../../test/mocks/mockAsyncRequest");

const namespace = Config.get('runtime.namespace');
const hostname = Config.get('cna.hostname') || 'adobeioruntime.net';
const packagejson = JSON.parse(fs.readFileSync('package.json').toString());
const runtimePackage = `${packagejson.name}-${packagejson.version}`
const actionPrefix = `https://${namespace}.${hostname}/api/v1/web/${runtimePackage}`
const actionUrl = `${actionPrefix}/submitAsyncAction`;

describe('submitAsyncAction e2e test', () => {
    var target = "test/country-codes.csv"
    var params = {
        "target": target,
        "file": "country,alpha-2,alpha-3,numeric\rZimbabwe,ZW,ZWE,716;"
    }
    
    test('submit async w/ valid params', async () => {
        var ulRes = await fetch(uploadUrl, { method: "POST", body: JSON.stringify(params), headers: { 'Content-Type': 'application/json' } });
        var res = await fetch(actionUrl, { headers: { "Content-Type": "application/json", "X-OW-EXTRA-LOGGING": "on" }, body: mockSingleLead,  method: "POST" })
        console.log(res);
        var json = await res.json();
        console.log(json);
        expect(res).toEqual(expect.objectContaining({ status: 201 }))
    })
})