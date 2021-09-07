const serviceIcon = require('../../../actions/flow/v1/serviceIcon')
const { svg } = require('../../../resources/images/icon')
const {mockIconRequest} = require('../../mocks/mockIconRequest')

describe('serviceIcon e2e test', () => {
    jest.setTimeout(10000)
    test('exec w/ valid params', async () => {

        var res = await serviceIcon.main(mockIconRequest);
        console.log(res)
        expect(res.body).toEqual(svg)
    })
})