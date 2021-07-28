const { Config } = require('@adobe/aio-sdk').Core
const fs = require('fs')
const fetch = require('node-fetch')
const testUtils = require("../../test/lib/testUtils")

// get action url
const namespace = Config.get('runtime.namespace');
const hostname = Config.get('cna.hostname') || 'adobeioruntime.net';
const packagejson = JSON.parse(fs.readFileSync('package.json').toString());
const runtimePackage = `${packagejson.name}-${packagejson.version}`
const actionUrl = `https://${namespace}.${hostname}/api/v1/web/${runtimePackage}/upload-file`;

describe('upload-file end to end test', () => {
    test('upload a file w/ json', async () => {
        var target = "test/testfile.txt"
        var params = {
            "target": target,
            "file": "asdfqwer1234"
        }
        headers = { 'Content-Type': 'application/json' };
        testUtils.addAuthHeaders(headers);
        // console.log(headers)
        var res = await fetch(actionUrl, { method: "POST", body: JSON.stringify(params), headers: headers });
        var jsonRes = await res.json();
        // console.debug(jsonRes);
        expect(res).toEqual(expect.objectContaining({ status: 200 }))
        expect(jsonRes.props).toEqual(expect.objectContaining({ name: target }))
    })
})
