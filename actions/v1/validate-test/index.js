const { Core } = require('@adobe/aio-sdk');
const fetch = require('node-fetch');
const { stringParameters, errorResponse, validateSchema } = require('../../utils');

var openwhisk = require('openwhisk');

async function main(params) {

    const logger = Core.Logger('main', { level: params.LOG_LEVEL || 'info' });
    logger.info("Calling Main Action for Validate");

    logger.debug(stringParameters(params));

    var response = {
        "body": {
        }
    };
    
    try {
        var schemaName = "test-schema";
        var object = {"foo": 1, "bar":"baz"};

        response["body"]["success"] = await validateSchema(schemaName, object);

        return response
    } catch (error) {
        logger.info(error);
        return errorResponse(400, error, logger)
    }
    return errorResponse(400, {"message": "something went wrong"}, logger)
}

module.exports = {
    main

}