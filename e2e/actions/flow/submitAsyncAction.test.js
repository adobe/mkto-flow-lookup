const { Config } = require('@adobe/aio-sdk').Core
const fs = require('fs')
const fetch = require('node-fetch')
const { uploadUrl, actionPrefix } = require('../../../lib/constants');
const { mockSingleLead } = require("../../../test/mocks/mockAsyncRequest");

// const namespace = Config.get('runtime.namespace');
// const hostname = Config.get('cna.hostname') || 'adobeioruntime.net';
// const packagejson = JSON.parse(fs.readFileSync('package.json').toString());
// const runtimePackage = `${packagejson.name}-${packagejson.version}`
// const actionPrefix = `https://${namespace}.${hostname}/api/v1/web/${runtimePackage}`
const actionUrl = `${actionPrefix}/submitAsyncAction`;

describe('submitAsyncAction e2e test', () => {
    var target = "test/country-codes.csv"
    var params = {
        "target": target,
        "file": "country,alpha-2,alpha-3,numeric\rZimbabwe,ZW,ZWE,716;"
    }
    var openwhisk = require('openwhisk');
    var ow = openwhisk({"api_key": Config.get("runtime.auth"), "apihost": Config.get("runtime.apihost")});
    test('submit async w/ valid params', async () => {
        var ulRes = await fetch(uploadUrl, { method: "POST", body: JSON.stringify(params), headers: { 'Content-Type': 'application/json' } });
        var res = await fetch(actionUrl, { headers: { "Content-Type": "application/json", "X-OW-EXTRA-LOGGING": "on" }, body: JSON.stringify(mockSingleLead),  method: "POST" })
        console.log(res.headers);
        //get callback activation id
        var cbActId = await res.headers.get("X-CB-Activation-Id");
        
        // console.log("cb url: ", mockSingleLead.callbackUrl)
        console.log(res);
        // console.log(await res.text())
        // var json = await res.json();
        // console.log(json);
        expect(res).toEqual(expect.objectContaining({ status: 201 }))
        //"X-CB-Activation-Id"
        console.log("cbActId: ", cbActId);
        var cbAct = await ow.activations.get(cbActId);
        console.log("cbAct: ", cbAct);
        expect(cbAct.response.result.body.objectData[0].leadData).toEqual(expect.objectContaining({"country-code-2": "ZW", "id": 1000000}));
    })
})