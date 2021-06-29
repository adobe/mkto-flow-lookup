const { Core } = require('@adobe/aio-sdk');
const {stringParameters, checkMissingRequestInputs, handleFNF } = require('../../utils');

const AJV = require('ajv');
const ajv = new AJV();

const actionName = "validate";

var ts = {
        type: "object",
        properties: {
            foo: { type: "integer" },
            bar: { type: "string" }
        },
        required: ["foo"],
        additionalProperties: false,
    }

var validators = {};
validators['test-schema'] = ajv.compile(ts);

async function main(params) {

    const logger = Core.Logger('main', { level: params.LOG_LEVEL || 'info' })
    logger.info("Calling Main Action for Validate")

    logger.debug(stringParameters(params));

    const requiredParams = ['schemaName', 'object'];
    const requiredHeaders = [];
    const errorMessage = checkMissingRequestInputs(params, requiredParams, requiredHeaders)
    if (errorMessage) {
        return errorResponse(400, errorMessage, logger)
    }

    var response = {
        "body": {}
    };
    try {
        if(validators[params.schemaName]){
            if(validators[params.schemaName](params.object)){
                logger.debug('validator found w/ name' + params.schemaName);
                response['body']['success'] = true;
                return response;
            }
        }
    } catch (error) {
        response['body']['success'] = false;
        response['body']['error'] = error;
        return response
    }
    var notFoundMsg = "validator not found for schema"
    response['body']['error'] = {
        "message": notFoundMsg
    }
    response['body']['success'] = false;
    logger.debug(response);
    return response;
}

function getActionName(){
    return actionName;
}

module.exports = {
    main,
    getActionName

}