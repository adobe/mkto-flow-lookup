const { Config } = require('@adobe/aio-sdk').Core
const fs = require('fs')
const fetch = require('node-fetch')
const { v4: uuidv4 } = require('uuid');

// get action url
const namespace = Config.get('runtime.namespace');
const hostname = Config.get('cna.hostname') || 'adobeioruntime.net';
const packagejson = JSON.parse(fs.readFileSync('package.json').toString());
const runtimePackage = `${packagejson.name}-${packagejson.version}`
const actionPrefix = `https://${namespace}.${hostname}/api/v1/web/${runtimePackage}`
const actionUrl = `${actionPrefix}/list-files`;
const target = "test/1.txt";
const file1 = {
    "target": target,
};
var defaultParams = {
    method: "POST",
    body: JSON.stringify(file1),
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
        var res = await fetch(actionUrl, defaultParams);

        try {
            var jsonRes = await res.json();
            console.debug(jsonRes);
        } catch (error) {
            console.log(error);
        }

        expect(res).toEqual(expect.objectContaining({ status: 200 }))
        expect(jsonRes.files[0]).toEqual(expect.objectContaining({ name: target }))
    })
    test('no target input', async () => {
        var res = await fetch(actionUrl);
        console.debug(res);
        expect(res).toEqual(expect.objectContaining({ status: 400 }));
    })
})