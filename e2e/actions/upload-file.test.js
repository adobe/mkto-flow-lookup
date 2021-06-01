const { Config } = require('@adobe/aio-sdk').Core
const fs = require('fs')
const fetch = require('node-fetch')

// get action url
const namespace = Config.get('runtime.namespace');
const hostname = Config.get('cna.hostname') || 'adobeioruntime.net';
const packagejson = JSON.parse(fs.readFileSync('package.json').toString());
const runtimePackage = `${packagejson.name}-${packagejson.version}`
const actionUrl = `https://${namespace}.${hostname}/api/v1/web/${runtimePackage}/upload-file`;

describe('upload-file end to end test', () => {
    test('upload a file w/ json', async () => {
        var params = {
            "target": "test/testfile.txt",
            "file": "asdfqwer1234"
        }
        var res = await fetch(actionUrl, {method: "POST", body: JSON.stringify(params), headers: { 'Content-Type': 'application/json' }})
        expect(res).toEqual(expect.objectContaining({status:200}))
    })
})
