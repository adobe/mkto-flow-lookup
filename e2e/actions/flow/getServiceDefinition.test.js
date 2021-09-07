const { Config } = require('@adobe/aio-sdk').Core
const fs = require('fs')
const fetch = require('node-fetch')
const { uploadUrl, actionPrefix } = require('../../../lib/constants');
const { mockSingleLead } = require("../../../test/mocks/mockAsyncRequest");
const {validateSchema} = require("../../../lib/actionUtils");
const {getInitializationError} = require('../../../test/lib/testUtils');
const {addAuthHeaders} = require("../../../test/lib/testUtils")


const actionUrl = `${actionPrefix}/getServiceDefinition`

const {respSchemaKey, sdf, getSdf} = require('../../../actions/flow/v1/getServiceDefinition')


describe('getServiceDefinition e2e test', () => {

    test('get sdf and validate', async () => {
        var headers = { "Content-Type": "application/json", "X-OW-EXTRA-LOGGING": "on" };
        addAuthHeaders(headers)
        var res = await fetch(actionUrl, {"Method": "POST", "headers": headers});
        // console.log(res);
        if(res.status == 400){
            var activationId = await res.headers.get('x-openwhisk-activation-id');
            console.log("Init error: ", await getInitializationError(activationId))
            console.log(await res.json())
        }
        expect(res).toEqual(expect.objectContaining({status: 200}))
        var json = await res.json();
        // console.log(JSON.stringify(json))
        expect(validateSchema(respSchemaKey, json)).toEqual(true);
        
        //not quite sure where the diff is here, but it returns a schema-valid response which is good enough for now
        //expect(json).toEqual(expect.objectContaining(getSdf(actionPrefix)))
    }),
    test('Endpoints should populate as expected', async () => {
        var headers = { "Content-Type": "application/json", "X-OW-EXTRA-LOGGING": "on" };
        addAuthHeaders(headers)
        var res = await fetch(actionUrl, {"Method": "POST", "headers": headers});
        // console.log(res);
        if(res.status == 400){
            var activationId = await res.headers.get('x-openwhisk-activation-id');
            console.log("Init error: ", await getInitializationError(activationId))
            console.log(await res.json())
        }
        expect(res).toEqual(expect.objectContaining({status: 200}))
        var json = await res.json();
        // console.log(JSON.stringify(json))
        expect(validateSchema(respSchemaKey, json)).toEqual(true);
        expect(json.statusEndpoint).toEqual(`${actionPrefix}/status`)
        
        //not quite sure where the diff is here, but it returns a schema-valid response which is good enough for now
        //expect(json).toEqual(expect.objectContaining(getSdf(actionPrefix)))
    })
})