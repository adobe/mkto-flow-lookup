const { Core } = require('@adobe/aio-sdk');
const {stringParameters, checkMissingRequestInputs, handleFNF } = require('../../utils');

const ajv = require('ajv');

var ts = {
        type: "object",
        properties: {
            foo: { type: "integer" },
            bar: { type: "string" }
        },
        required: ["foo"],
        additionalProperties: false,
    }

var validators;
validators['test-schema'] = ajv.compile(ts);

function main(params) {

    const logger = Core.Logger('main', { level: params.LOG_LEVEL || 'info' })
    logger.info("Calling Main Action for Validate")

    logger.debug(stringParameters(params));

    const requiredParams = ['schemaName', 'validate'];
    const requiredHeaders = [];
    const errorMessage = checkMissingRequestInputs(params, requiredParams, requiredHeaders)
    if (errorMessage) {
        return errorResponse(400, errorMessage, logger)
    }

    var response = {};
    try {
        if(validators[params.schemaName]){
            if(validators[params.schemaName](params.validate)){
                logger.debug('validator found w/ name' + params.schemaName);
                response['success'] = true;
                return response;
            }
        }
    } catch (error) {
        response['success'] = false;
        response['error'] = error;
        return response
    }
    var notFoundMsg = "validator not found for schema"
    response['error'] = {
        "message": notFoundMsg
    }
    response['success'] = false;
    logger.debug(response);
    return response;
}