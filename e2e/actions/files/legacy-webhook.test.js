const { Config } = require('@adobe/aio-sdk').Core
const fs = require('fs')
const fetch = require('node-fetch')
const { v4: uuidv4 } = require('uuid');
const {uploadUrl} =  require('../../../lib/constants');
const wh = require('../../webhook-helper');
const {addAuthHeaders} = require("../../../test/lib/testUtils")

// get action url
const namespace = Config.get('runtime.namespace');
const hostname = Config.get('cna.hostname') || 'adobeioruntime.net';
const packagejson = JSON.parse(fs.readFileSync('package.json').toString());
const runtimePackage = `${packagejson.name}-${packagejson.version}`
const actionPrefix = `https://${namespace}.${hostname}/api/v1/web/${runtimePackage}`
const actionUrl = `${actionPrefix}/legacy-webhook`;
const target = "/test/1.txt";

describe("testing legacy Marketo webhook action", () => {
    test('testing webhook happy path', async () => {
        // console.log(actionUrl);
        var target = "test/country-codes.csv"
        var params = {
            "target": target,
            "file": "country,alpha-2,alpha-3,numeric\r\nZimbabwe,ZW,ZWE,716;"
        }
        headers = { 'Content-Type': 'application/json' }
        addAuthHeaders(headers);
        var ulRes = await fetch(uploadUrl, {method: "POST", body: JSON.stringify(params), headers: headers});
        // console.log(await ulRes.json())
        var whParams = wh.getWHMockReq();
        addAuthHeaders(whParams.headers)
        var res = await fetch(actionUrl, whParams);
        // console.log(res);
        expect(res).toEqual(expect.objectContaining({status:200}));
        var json = await res.json();
        // console.log(json);
        expect(json['country-code-2']).toEqual('ZW');
    })
})

