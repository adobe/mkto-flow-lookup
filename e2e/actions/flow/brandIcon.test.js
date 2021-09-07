//const { Config } = require('@adobe/aio-sdk').Core
const fs = require('fs')
const fetch = require('node-fetch')
const {actionPrefix} = require('../../../lib/constants');
const {addAuthHeaders, getInitializationError} = require("../../../test/lib/testUtils")
const {svg} = require('../../../resources/images/icon')
const {mockIconRequest} = require('../../../test/mocks/mockIconRequest')

const actionUrl = `${actionPrefix}/brandIcon.svg`;


describe('brandIcon e2e test', () => {
    jest.setTimeout(10000)
    var headers = { "Content-Type": "application/json", "X-OW-EXTRA-LOGGING": "on" };
    addAuthHeaders(headers)
    test('exec w/ valid params', async () => {
        
        var res = await fetch(actionUrl, {"headers": headers, body: JSON.stringify(mockIconRequest), method: "POST"})
        console.log(res);
        if(res.status >= 400){
            console.log(await getInitializationError(res.headers.get('x-openwhisk-activation-id')))
        }
        // var json = await res.json();
        // console.log(JSON.stringify(json))
        expect(await res.text()).toEqual(svg)
    })
})