const {mockSingleLead} = require("../mocks/mockAsyncRequest");
const {validateSchema} = require("../../actions/utils");
const {schemaKey} = require("../../actions/flow/v1/submitAsyncAction");


describe('async test', () => {
    test('test swagger validation', async () => {
        var result = validateSchema(schemaKey, mockSingleLead);
        expect(result).toEqual(true);
    })
})