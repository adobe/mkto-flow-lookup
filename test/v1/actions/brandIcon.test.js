//const { Config } = require('@adobe/aio-sdk').Core
const fs = require('fs')
const fetch = require('node-fetch')
const { addAuthHeaders } = require("../../../test/lib/testUtils")
const { actionPrefix } = require('../../../lib/constants');
const brandIcon = require('../../../actions/flow/v1/brandIcon')
const { svg } = require('../../../resources/images/icon')
const {mockIconRequest} = require('../../mocks/mockIconRequest')


const actionUrl = `${actionPrefix}/brandIcon`;


describe('brandIcon e2e test', () => {
    jest.setTimeout(10000)
    test('exec w/ valid params', async () => {

        var res = await brandIcon.main(mockIconRequest);
        console.log(res)
        expect(res.body).toEqual(svg)
    })
})