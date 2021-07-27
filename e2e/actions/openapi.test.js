const fetch = require('node-fetch')
const { uploadUrl, actionPrefix } = require('../../lib/constants');
const {getInitializationError} = require('../../test/lib/testUtils');
const actionUrl = `${actionPrefix}/fileSwagger`
const jwt = require('../../lib/jsonWebToken')

const { Config } = require('@adobe/aio-sdk').Core


const orgId = Config.get("ims.contexts.aio-4566206088344642952.ims.org.id")


describe('e2e tests for serving swagger definition', ()=>{
    var authToken = await jwt.getToken();
    console.log("apiKey: ", authToken);
    console.log("orgId: ", orgId)
    test('metaschema validation', async () => {
        var res = await fetch(actionUrl, { headers: { "Content-Type": "application/json", "X-OW-EXTRA-LOGGING": "on", "x-gw-ims-org-id": orgId, "Authorization": `Bearer ${authToken}` }, method: "GET" })
        //console.log(res)
        if(res.status >= 400){
            var activationId = await res.headers.get('x-openwhisk-activation-id');
            console.log("Init error: ", await getInitializationError(activationId))
            console.log(await res.json())
        }
        expect(res).toEqual(expect.objectContaining({status: 200}));
    })
    test('auth should fail w/ 401', async () => {
        var res = await fetch(actionUrl, { headers: { "Content-Type": "application/json", "X-OW-EXTRA-LOGGING": "on", 
        //"x-gw-ims-org-id": orgId, 
        //"Authorization": "Bearer " + "badtoken" 
        }, method: "GET" });
        // console.log(await res.json())
        expect(res).toEqual(expect.objectContaining({status: 401}))
    }),
    test('auth should fail w/ 403', async () => {
        var res = await fetch(actionUrl, { headers: { "Content-Type": "application/json", "X-OW-EXTRA-LOGGING": "on", 
        "x-gw-ims-org-id": orgId, 
        "Authorization": "Bearer " + "badtoken" 
        }, method: "GET" });
         console.log("403 json: " + JSON.stringify(await res.json()))
        expect(res).toEqual(expect.objectContaining({status: 403}))
    })
    // test('auth should succeed', async () => {
    //     var res = await fetch(actionUrl, { headers: { "Content-Type": "application/json", "X-OW-EXTRA-LOGGING": "on", "x-gw-ims-org-id": orgId, "Authorization": "Bearer " + apiKey }, method: "POST" });
    //     expect(res).toEqual(expect.objectContaining({status: 200}));
    // })
})