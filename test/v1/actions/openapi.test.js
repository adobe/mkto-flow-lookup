const meta = require('../../../resources/v1/CFA-Swagger').swagger
const swagger = require('../../../resources/v1/svcSwagger').swagger

const AJV = require('ajv');
const ajv = new AJV({unknownFormats: ["int32", "int64"]});
ajv.addMetaSchema(meta, "cfa-swagger")

describe('tests for serving swagger definition', ()=>{
    test('metaschema validation', async () => {
        expect(ajv.validateSchema(swagger)).toEqual(true);
    })
})