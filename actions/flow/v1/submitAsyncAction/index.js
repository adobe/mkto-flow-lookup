const { Core } = require('@adobe/aio-sdk')
const { errorResponse, getBearerToken, stringParameters, checkMissingRequestInputs, handleFNF, validateSchema, getRuntimePkgName } = require('../../../utils')

const lts = require("../../../../lib/lookupTableSearch.js");
const filesLib = require('@adobe/aio-lib-files');

const schemaKey = "#/components/schemas/async";

const cbActionName = require('../executeCallback').actionName;

var openwhisk = require('openwhisk');

async function main(params) {
    const logger = Core.Logger('main', { level: params.LOG_LEVEL || 'info' })

    // 'info' is the default level if not set
    logger.info('Calling the main action')

    // log parameters, only if params.LOG_LEVEL === 'debug'
    logger.debug(stringParameters(params))

    try {
        validateSchema(schemaKey, params);
    } catch (error) {
        logger.info(error)
        return errorResponse(400, error, logger);
    }

    var ow;
    try {
        ow = openwhisk();
    } catch (error) {
        logger.info(error);
        return errorResponse(500, error, logger)
    }

    var activationId;
    try {
        var actionNameStr = getRuntimePkgName() + '/' + cbActionName;
        logger.debug(actionNameStr)
        var activation = await ow.actions.invoke({
            name: actionNameStr,
            blocking: false,
            result: false,
            params: params
        })
        activationId = activation.activationId;
        logger.debug(activationId);
    } catch (error) {
        logger.info(error);
        return {
            "statusCode": 500,
            "body": {
                "error": {
                    "message": "Callback creation failed",
                    "details": error
                }
            }
        }
    }

    return {
        "statusCode": 201,
        "body": "Accepted:\n- Webhook created",
        "headers": {
            "Content-Type": "text/plain",
            "X-CB-Activation-Id": activationId
        }
    }
}

module.exports = {
    main,
    schemaKey
}