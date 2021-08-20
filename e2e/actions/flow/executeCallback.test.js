//const { Config } = require('@adobe/aio-sdk').Core
const fs = require('fs')
const fetch = require('node-fetch')
const {uploadUrl, actionPrefix} = require('../../../lib/constants');
const {mockSingleLead} = require('../../../test/mocks/mockAsyncRequest')
const {addAuthHeaders} = require("../../../test/lib/testUtils")

const actionUrl = `${actionPrefix}/executeCallback`;


describe('executeCallback e2e test', () => {
    var target = "country-codes.csv"
    var params = {
        "target": target,
        "file": "country,alpha-2,alpha-3,numeric\rZimbabwe,ZW,ZWE,716;"
    }
    test('exec w/ valid params', async () => {
        var ulHeaders = { 'Content-Type': 'application/json' };
        addAuthHeaders(ulHeaders)
        var ulRes = await fetch(uploadUrl, { method: "POST", body: JSON.stringify(params), headers: ulHeaders });
        var headers = {"Content-Type": "application/json", "X-OW-EXTRA-LOGGING": "on"};
        addAuthHeaders(headers)
        var res = await fetch(actionUrl, {"headers": headers, body: JSON.stringify(mockSingleLead), method: "POST"})
        console.log(res);
        var json = await res.json();
        console.log(JSON.stringify(json))
        expect(json.objectData[0].leadData).toEqual(expect.objectContaining({"countryCode2": "ZW", "id": 1000000}))
    })
})