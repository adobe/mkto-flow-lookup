const { Config } = require('@adobe/aio-sdk').Core
const fs = require('fs')
const fetch = require('node-fetch')
const { v4: uuidv4 } = require('uuid');
const { namespace, hostname, packagejson, runtimePackage, propsUrl, uploadUrl, deleteUrl, actionPrefix } = require("../constants.js");

// get action url
/* const namespace = Config.get('runtime.namespace');
const hostname = Config.get('cna.hostname') || 'adobeioruntime.net';
const packagejson = JSON.parse(fs.readFileSync('package.json').toString());
const runtimePackage = `${packagejson.name}-${packagejson.version}`
const actionPrefix = `https://${namespace}.${hostname}/api/v1/web/${runtimePackage}` */
const actionUrl = propsUrl;

const dir = "/test/"
const t1 = dir + "1.txt";
var file1 = {
    "target": t1,
    "file": "asdfqwer1234"
};
const target = t1;

var defaultParams = {
    method: "POST",
    body: JSON.stringify({
        "target": "/test/1.txt",
        "file": "asdfqwer1234"
    }),
    headers: { "Content-Type": "application/json" }
};
var badParams = {
    method: "POST",
    body: JSON.stringify({ "target": uuidv4() }),
    headers: { "Content-Type": "application/json" }
};

describe('file-properties end to end test', () => {
    test('look for fake file', async () => {
        console.debug(badParams);
        var res = await fetch(actionUrl, badParams);
        console.debug(res);
        expect(res).toEqual(expect.objectContaining({ status: 404 }));
    })
    test('retrieve properties of a file', async () => {
        // console.debug(uploadUrl, defaultParams);
        var res1 = await fetch(uploadUrl, defaultParams );
        console.debug(await res1.json());
        var res = await fetch(actionUrl, defaultParams);
        var jsonRes = await res.json();
        console.debug(jsonRes);
        expect(res).toEqual(expect.objectContaining({ status: 200 }));
        
        //expect(jsonRes).toEqual(expect.objectContaining({props: expect.objectContaining({name: target})}));
    })
    test('no target input', async () => {
        var res = await fetch(actionUrl);
        console.debug(res);
        expect(res).toEqual(expect.objectContaining({ status: 400 }));
    })
})