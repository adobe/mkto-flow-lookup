const { Config } = require('@adobe/aio-sdk').Core
const fs = require('fs')
const fetch = require('node-fetch')

// get action url
const namespace = Config.get('runtime.namespace');
const hostname = Config.get('cna.hostname') || 'adobeioruntime.net';
const packagejson = JSON.parse(fs.readFileSync('package.json').toString());
const runtimePackage = `${packagejson.name}-${packagejson.version}`
const actionUrl = `https://${namespace}.${hostname}/api/v1/web/${runtimePackage}/file-properties`;

describe('file-properties end to end test'), () => {
    test('look for fake file', () => {
        var params = {
            "target": randomUUID()
        }
        var res = await fetch(actionUrl, {method: "POST", body = params})
        expect(res).toEqual(expect.objectContaining({status:404}))
    })
}