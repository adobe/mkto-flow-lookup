const { Config } = require('@adobe/aio-sdk').Core
const fs = require('fs')
const fetch = require('node-fetch')
const { uploadUrl, actionPrefix } = require('../../../lib/constants');
const { mockSingleLead } = require("../../../test/mocks/mockAsyncRequest");
const {addAuthHeaders} = require("../../../test/lib/testUtils")

const actionUrl = `${actionPrefix}/submitAsyncAction`;

describe('submitAsyncAction e2e test', () => {
    var target = "test/country-codes.csv"
    var params = {
        "target": target,
        "file": "country,alpha-2,alpha-3,numeric\rZimbabwe,ZW,ZWE,716;"
    }
    var openwhisk = require('openwhisk');
    var ow = openwhisk({"api_key": Config.get("runtime.auth"), "apihost": Config.get("runtime.apihost")});
    var cbActId;
    test('submit async w/ valid params', async () => {
        var ulHeaders = { 'Content-Type': 'application/json' };
        addAuthHeaders(ulHeaders);
        var ulRes = await fetch(uploadUrl, { method: "POST", body: JSON.stringify(params), headers:  ulHeaders});
        // console.log(JSON.stringify(mockSingleLead))
        var headers = { "Content-Type": "application/json", "X-OW-EXTRA-LOGGING": "on" };
        addAuthHeaders(headers)
        var res = await fetch(actionUrl, { headers: headers, body: JSON.stringify(mockSingleLead),  method: "POST" })
        // console.log(res.headers);
        //get callback activation id
        cbActId = await res.headers.get("X-CB-Activation-Id");
        // console.log("cb act id: ", cbActId)
        // console.log(res);
        // console.log(await res.text())
        // var json = await res.json();
        // console.log(json);
        expect(res).toEqual(expect.objectContaining({ status: 201 }))
        
    })
    test('validate callback activation', async ()=>{
        var cbAct = await ow.activations.get(cbActId);
        // console.log("cbAct: ", cbAct);
        expect(cbAct.response.result.body.objectData[0].leadData).toEqual(expect.objectContaining({"country-code-2": "ZW", "id": 1000000}));
    })
})