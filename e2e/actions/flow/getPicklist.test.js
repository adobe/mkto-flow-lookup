//const { Config } = require('@adobe/aio-sdk').Core
const fs = require('fs')
const fetch = require('node-fetch')
const { uploadUrl, actionPrefix } = require('../../../lib/constants');
const { tableReq, knReq, kvReq, lookupReq, rfReq, rfReqNoCtxt, lookupReqNoCtxt, kvReqNoCtxt } = require('../../../test/mocks/mockGetPicklistRequest')
const { addAuthHeaders, getInitializationError } = require("../../../test/lib/testUtils")
const { reqSchemaKey, respSchemaKey } = require('../../../actions/flow/v1/getPicklist')
const { validateSchema } = require('../../../lib/actionUtils')

const actionUrl = `${actionPrefix}/getPicklist`;


describe('getPicklist e2e test', () => {
    jest.setTimeout(10000)

    var target = "country-codes.csv"
    var params = {
        "target": target,
        "file": "country,alpha-2,alpha-3,numeric\rZimbabwe,ZW,ZWE,716;"
    }
    var headers = { "Content-Type": "application/json", "X-OW-EXTRA-LOGGING": "on" };
    test('tableChoices', async () => {
        var ulHeaders = { 'Content-Type': 'application/json' };
        addAuthHeaders(ulHeaders)
        var ulRes = await fetch(uploadUrl, { method: "POST", body: JSON.stringify(params), headers: ulHeaders });

        addAuthHeaders(headers)
        var res = await fetch(actionUrl, { method: "POST", body: JSON.stringify(tableReq), headers: headers });
        if(res.status >= 400){
            console.log(await getInitializationError(res.headers.get('x-openwhisk-activation-id')))
        }
        // console.log("res: ", res)
        var json = await res.json();
        // console.log(json)
        expect(res).toEqual(expect.objectContaining({ status: 200 }))

        expect(json.choices[0].displayValue.en_US).toEqual("country-codes.csv");
        expect(json.choices[0].submittedValue).toEqual("country-codes.csv");
        expect(validateSchema(respSchemaKey, json)).toEqual(true);
    })
    test('knChoices', async () => {
        var res = await fetch(actionUrl, { method: "POST", body: JSON.stringify(knReq), headers: headers });
        if (res.status >= 400) {
            console.log(await getInitializationError(res.headers.get('x-openwhisk-activation-id')))
        }
        expect(res).toEqual(expect.objectContaining({ status: 200 }))
        var json = await res.json();
        console.log(JSON.stringify(json))
        expect(json.choices[0].displayValue.en_US).toEqual("country-codes.csv - country");
        expect(json.choices[0].submittedValue).toEqual("country");
    })
    test('kvChoices', async () => {
        var res = await fetch(actionUrl, { method: "POST", body: JSON.stringify(kvReq), headers: headers });
        expect(res).toEqual(expect.objectContaining({ status: 200 }))
        var json = await res.json();
        console.log(json)
        expect(json.choices[0].displayValue.en_US).toEqual("country");
        expect(json.choices[0].submittedValue).toEqual("country");
    })
    test('kvChoices w/o context', async () => {
        var res = await fetch(actionUrl, { method: "POST", body: JSON.stringify(kvReqNoCtxt), headers: headers });
        expect(res).toEqual(expect.objectContaining({ status: 200 }))
    })
    test('lookupChoices', async () => {
        var res = await fetch(actionUrl, { method: "POST", body: JSON.stringify(lookupReq), headers: headers });
        expect(res).toEqual(expect.objectContaining({ status: 200 }))
        var json = await res.json();
        console.log(json)
        // expect(json.choices).toEqual(expect.arrayContaining([{ submittedValue: "alpha-2" }])); 
        expect(json.choices).toEqual(expect.arrayContaining([{"displayValue": {"en_US": "country-codes.csv - alpha-2"}, "submittedValue": "alpha-2"}]))
        //expect(json.choices).toEqual(expect.arrayContaining(expect.objectContaining({ displayValue: expect.objectContaining({ en_US: "alpha-2" }) })));
    }),
    test('lookupChoices w/o context', async () => {
        var res = await fetch(actionUrl, { method: "POST", body: JSON.stringify(lookupReqNoCtxt), headers: headers });
        expect(res).toEqual(expect.objectContaining({ status: 200 }))
        var json = await res.json();
        console.log(json)
        // expect(json.choices).toEqual(expect.arrayContaining([{ submittedValue: "alpha-2" }])); 
        expect(json.choices).toEqual(expect.arrayContaining([{"displayValue": {"en_US": "country-codes.csv - alpha-2"}, "submittedValue": "alpha-2"}]))
        //expect(json.choices).toEqual(expect.arrayContaining(expect.objectContaining({ displayValue: expect.objectContaining({ en_US: "alpha-2" }) })));
    })
    test('rfChoices', async () => {
        var res = await fetch(actionUrl, { method: "POST", body: JSON.stringify(rfReq), headers: headers });
        expect(res).toEqual(expect.objectContaining({ status: 200 }))
        var json = await res.json();
        console.log(json)
        expect(json.choices[0].displayValue.en_US).toEqual("countryCode2");
        expect(json.choices[0].submittedValue).toEqual("countryCode2");
    }),
    test('rfChoices w/o fieldMappingContext', async () => {
        var res = await fetch(actionUrl, { method: "POST", body: JSON.stringify(rfReqNoCtxt), headers: headers });
        expect(res).toEqual(expect.objectContaining({ status: 200 }))
    })
})