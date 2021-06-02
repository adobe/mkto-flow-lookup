const { Config } = require('@adobe/aio-sdk').Core
const fs = require('fs')
const fetch = require('node-fetch')

// get action url
const namespace = Config.get('runtime.namespace');
const hostname = Config.get('cna.hostname') || 'adobeioruntime.net';
const packagejson = JSON.parse(fs.readFileSync('package.json').toString());
const runtimePackage = `${packagejson.name}-${packagejson.version}`
const actionPrefix = `https://${namespace}.${hostname}/api/v1/web/${runtimePackage}`
const actionUrl = `${actionPrefix}/file-properties`;
const uploadUrl = `${actionPrefix}/upload-file`
const deleteUrl = `${actionPrefix}/delete-file`

jest.setTimeout(10000)

const dir = "test/"

const t1 = dir + "1.txt";
const t2 = dir + "2.txt";
const t3 = dir + "3.txt";

const file1 = {
    "target": t1,
    "file": "asdfqwer1234"
};
const file2 = {
    "target": t2,
    "file": "asdfqwer1234"
};
const file3 = {
    "target": t3,
    "file": "asdfqwer1234"
}

beforeEach(async () => {
    var res1 = await fetch(uploadUrl, {method: "POST", body: JSON.stringify(file1), headers: { 'Content-Type': 'application/json' }})
    logger.debug(res1);
    var res2 = await fetch(uploadUrl, {method: "POST", body: JSON.stringify(file2), headers: { 'Content-Type': 'application/json' }})
    logger.debug(res2);
    var res3 = await fetch(uploadUrl, {method: "POST", body: JSON.stringify(file3), headers: { 'Content-Type': 'application/json' }})
    logger.debug(res3);


 })
afterEach(async () => { 
    var res1 = await fetch(deleteUrl, {method: "POST", body: JSON.stringify(file1), headers: { 'Content-Type': 'application/json' }})
    logger.debug(res1);
    var res2 = await fetch(deleteUrl, {method: "POST", body: JSON.stringify(file2), headers: { 'Content-Type': 'application/json' }})
    logger.debug(res2);
    var res3 = await fetch(deleteUrl, {method: "POST", body: JSON.stringify(file3), headers: { 'Content-Type': 'application/json' }})
    logger.debug(res3);
})
