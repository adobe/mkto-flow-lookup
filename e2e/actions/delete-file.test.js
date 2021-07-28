const { Config } = require('@adobe/aio-sdk').Core
const fs = require('fs')
const fetch = require('node-fetch')
const { v4: uuidv4 } = require('uuid');
const {uploadUrl, actionPrefix} = require('../../lib/constants');
const {addAuthHeaders} = require("../../test/lib/testUtils")


// get action url
const actionUrl = `${actionPrefix}/delete-file`;
const target = "/test/1.txt";
const file1 = {
    "target": target,
    "file": "asdfqwer"
};
var defaultParams = {
    method: "POST",
    body: JSON.stringify(file1),
    headers: { "Content-Type": "application/json" }
};
var badParams = {
    method: "POST",
    body: JSON.stringify({ "target": "asdf.txt" }),
    headers: { "Content-Type": "application/json" }
};

describe('delete-file end to end test', () => {
    addAuthHeaders(badParams.headers);
    addAuthHeaders(defaultParams.headers);
    test('delete a fake file', async () => {
        // console.debug(badParams);
        var res = await fetch(actionUrl, badParams);
        // console.debug(res);
        // console.debug(await res.json());
        expect(res).toEqual(expect.objectContaining({ status: 404 }));
    })
    test('delete a test file', async () => {
        var upload = await fetch(uploadUrl, defaultParams);
        // console.debug(await upload.json());
        // console.debug("default params: ", defaultParams);
        var res = await fetch(actionUrl, defaultParams);
        // console.debug(res);
        // console.debug(await res.json());
        expect(res).toEqual(expect.objectContaining({ status: 200}));
    })
    test('no target input', async () => {
        var res = await fetch(actionUrl, {headers: defaultParams.headers});
        // console.debug(res);
        expect(res).toEqual(expect.objectContaining({status: 400}));
    })
})