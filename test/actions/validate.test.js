const validate = require('../../actions/v1/validate');

describe('local tests for validate function', () => {
    test('', async () => {
        var mockParams = {
            "schemaName": "test-schema",
            "object": {"foo": 1, "bar":"baz"}
        }
        var res = await validate.main(mockParams);
        expect(res).toEqual(expect.objectContaining({success:true}))
    })
})