const {validateSchema} = require('../../../lib/actionUtils')
const {getSdf} = require('../../../actions/flow/v1/getServiceDefinition')
const {actionPrefix} = require('../../../lib/constants')

describe('getServiceDefinition local', () =>{
    test('validate sdf schema', async () => {
        var valid = validateSchema("#/components/schemas/serviceDefinition", getSdf(actionPrefix));
        expect(valid).toEqual(true)
    })
})