const { Config } = require('@adobe/aio-sdk').Core
const fs = require('fs')
const fetch = require('node-fetch')
const { uploadUrl, actionPrefix } = require('../../../lib/constants');
const { mockSingleLead } = require("../../../test/mocks/mockAsyncRequest");
const {validateSchema} = require("../../../lib/actionUtils");

const actionUrl = `${actionPrefix}/getServiceDefinition`

const {respSchemaKey, sdf} = require('../../../actions/flow/v1/getServiceDefinition')


describe('getServiceDefinition e2e test', () => {

    test('get sdf and validate', async () => {
        var res = await fetch(actionUrl, {"Method": "POST", "headers": { "Content-Type": "application/json", "X-OW-EXTRA-LOGGING": "on" }});
        console.log(res);
        //expect(res).toEqual(expect.objectContaining({status: 200}))
        var json = await res.json();
        console.log(json)
        //expect(validateSchema(respSchemaKey, json))
        expect(json).toEqual(sdf)
    })
})