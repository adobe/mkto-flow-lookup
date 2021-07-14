const { Core } = require('@adobe/aio-sdk');
const { stringParameters, checkMissingRequestInputs, handleFNF, validateSchema } = require('../../utils');

const stateLib = require('@adobe/aio-lib-state')



const actionName = 'vtest2';



async function main(params) {
    const logger = Core.Logger('main', { level: params.LOG_LEVEL || 'info' })
    logger.info("Calling Main Action for Validate")

    logger.debug(stringParameters(params));

    const state = await stateLib.init();
    
    var ts = {
        type: "object",
        properties: {
            foo: { type: "integer" },
            bar: { type: "string" }
        },
        required: ["foo"],
        additionalProperties: false,
    }

    var obj = { "foo": 1, "bar": "baz" };

    var schema;
    var result = false;

    logger.debug("trying to store schema");
    var key = await state.put('a', ts);

    logger.debug("key returned by put: " + key)
    logger.debug(key)
    logger.debug("trying to retrieve schema");
    var res = await state.get(key)
    logger.debug("res value: " + res.value)
    schema = res.value;
    logger.debug("schema: " + schema);

    logger.debug("trying to validate schema");
    result = await validateSchema(schema, obj);



    logger.debug("result: " + result);

    return {
        statusCode: 200,
        body: {
            success: result
        }
    }
}

module.exports = { main }