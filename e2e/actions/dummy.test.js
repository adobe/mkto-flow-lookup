const { Config } = require('@adobe/aio-sdk').Core
const fs = require('fs')
const fetch = require('node-fetch')
const { v4: uuidv4 } = require('uuid');
const {uploadUrl} = require('../constants');

// get action url
const namespace = Config.get('runtime.namespace');
const hostname = Config.get('cna.hostname') || 'adobeioruntime.net';
const packagejson = JSON.parse(fs.readFileSync('package.json').toString());
const runtimePackage = `${packagejson.name}-${packagejson.version}`
const actionPrefix = `https://${namespace}.${hostname}/api/v1/web/${runtimePackage}`
const actionUrl = `${actionPrefix}/dummy`;

describe('delete-file end to end test', () => {
    test('delete a test file', async () => {
        var res = await fetch(actionUrl);
        console.debug(res);
        console.debug(await res.json());
        expect(res).toEqual(expect.objectContaining({ status: 200}));
    })
})