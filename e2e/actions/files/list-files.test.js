const { Config } = require('@adobe/aio-sdk').Core
const fs = require('fs')
const fetch = require('node-fetch')
const { v4: uuidv4 } = require('uuid');
const {  uploadUrl } =  require('../../../lib/constants');
const {addAuthHeaders} = require("../../../test/lib/testUtils")

// get action url
const namespace = Config.get('runtime.namespace');
const hostname = Config.get('cna.hostname') || 'adobeioruntime.net';
const packagejson = JSON.parse(fs.readFileSync('package.json').toString());
const runtimePackage = `${packagejson.name}-${packagejson.version}`
const actionPrefix = `https://${namespace}.${hostname}/api/v1/web/${runtimePackage}`
const actionUrl = `${actionPrefix}/list-files`;
const dir = "/";
const target = dir + "/list-files-test.txt";
const file1 = {
    "target": target,
    "file": "asdfqwer1234"
};
var defaultParams = {
    method: "POST",
    body: JSON.stringify({ "target": dir }),
    headers: { "Content-Type": "application/json" }
};
var badParams = {
    method: "POST",
    body: JSON.stringify({ "target": uuidv4() }),
    headers: { "Content-Type": "application/json" }
};

describe('list-files end to end test', () => {
    addAuthHeaders(badParams.headers);
    addAuthHeaders(defaultParams.headers);
    test('look for fake dir', async () => {
        // console.debug(badParams);
        
        var res = await fetch(actionUrl, badParams);
        // console.debug(res);
        expect(res).toEqual(expect.objectContaining({ status: 204 }));
    })
    test('list dir contents', async () => {
        
        
        var ulParams = { method: "POST", body: JSON.stringify(file1), headers: defaultParams.headers }
        addAuthHeaders(ulParams.headers)
        var res1 = await fetch(uploadUrl, ulParams);
        // console.debug(await res1.json());
        var res = await fetch(actionUrl, defaultParams);
        expect(res.status).toBeGreaterThanOrEqual(200);
        expect(res.status).toBeLessThanOrEqual(204);

    })
    test('no target input', async () => {
        var headers = {}
        addAuthHeaders(headers)
        var res = await fetch(actionUrl, {headers:headers});
        // console.debug(await res.json());
        expect(res).toEqual(expect.objectContaining({ status: 400 }));
    })
})