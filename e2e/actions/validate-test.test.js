const { Config } = require('@adobe/aio-sdk').Core
const fetch = require('node-fetch')

// get action url
const namespace = Config.get('runtime.namespace');
const hostname = Config.get('cna.hostname') || 'adobeioruntime.net';
const packagejson = JSON.parse(fs.readFileSync('package.json').toString());
const runtimePackage = `${packagejson.name}-${packagejson.version}`
const actionPrefix = `https://${namespace}.${hostname}/api/v1/web/${runtimePackage}`
const actionUrl = `${actionPrefix}/validate-test`;

describe('running validate-test action test', () =>{
    var res = await fetch(actionUrl);
    expect(res).toEqual(expect.objectContaining({success: true}));
})