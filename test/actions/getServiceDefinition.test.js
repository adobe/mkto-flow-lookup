const {validateSchema} = require('../../lib/actionUtils')
const {sdf} = require('../../actions/flow/v1/getServiceDefinition/serviceDefinition')

describe('getServiceDefinition local', () =>{
    test('validate sdf schema', async () => {
        var valid = validateSchema("#/components/schemas/serviceDefinition", sdf);
        expect(valid).toEqual(true)
    })
})