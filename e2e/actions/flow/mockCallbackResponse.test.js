const fs = require('fs')
const fetch = require('node-fetch')
const { uploadUrl, actionPrefix, defaultHeaders } = require('../../../lib/constants');
const { mockSingleLead } = require("../../../test/mocks/mockCallbackRequest");
const actionUrl = `${actionPrefix}/mockCallbackResponse`
const {addAuthHeaders} = require("../../../test/lib/testUtils")


describe('mockCallbackResponse Test', () => {
    test('test mockCallback with good params', async () => {
        var headers = {"Content-Type": "application/json", "X-OW-EXTRA-LOGGING": "on"};
        addAuthHeaders(headers)
        var res = await fetch(actionUrl, {"method": "POST", body: JSON.stringify(mockSingleLead), headers: headers});
        // console.log(res);
        // var json = await res.json();
        // console.log(json);
        expect(res).toEqual(expect.objectContaining({status: 202}))
    })
})