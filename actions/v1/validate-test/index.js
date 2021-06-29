const { Core } = require('@adobe/aio-sdk');
const fetch = require('node-fetch');
const { stringParameters, errorResponse, getActionUrl } = require('../../utils');

var openwhisk = require('openwhisk');

async function main(params) {

    const logger = Core.Logger('main', { level: params.LOG_LEVEL || 'info' });
    logger.info("Calling Main Action for Validate");

    logger.debug(stringParameters(params));

    var response = {
        "body": {
            "foo":"bar"
        }
    };
    try {
        var ow;
        try{
            ow = openwhisk();
        }catch(error){
            return {
                "body": error
            }
        }
        
        var validRes =  await ow.actions.invoke({
            name: 'mkto-flow-lookup-0.0.1/validate',
            blocking: true,
            result: true,
            params: {
                "schemaName": "test-schema",
                "object": {"foo": 1, "bar":"baz"}
            }
        });
        response['body'] = validRes.body;
        
        logger.debug("ow invoke result: ", validRes)
        return response;
    } catch (error) {
        logger.info(error);
        return errorResponse(400, error, logger)
    }
    //return errorResponse(400, {"message": "something went wrong"}, logger)
    return response;
}

module.exports = {
    main

}