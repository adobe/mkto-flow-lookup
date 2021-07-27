const fetch = require('node-fetch')
const { uploadUrl, actionPrefix } = require('../../lib/constants');
const {getInitializationError} = require('../../test/lib/testUtils');
const actionUrl = `${actionPrefix}/fileSwagger.json`


describe('e2e tests for serving swagger definition', ()=>{
    test('metaschema validation', async () => {
        console.log(actionUrl)
        var res = await fetch(actionUrl, { headers: { "Content-Type": "application/json", "X-OW-EXTRA-LOGGING": "on" }, method: "POST" })
        console.log(res)
        if(res.status >= 400){
            var activationId = await res.headers.get('x-openwhisk-activation-id');
            console.log("Init error: ", await getInitializationError(activationId))
            console.log(await res.json())
        }
        expect(res).toEqual(expect.objectContaining({status: 200}));
    })
})