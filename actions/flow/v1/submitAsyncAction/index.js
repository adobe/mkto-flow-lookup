const { Core } = require('@adobe/aio-sdk')
const { errorResponse, getBearerToken, stringParameters, checkMissingRequestInputs, handleFNF, validateSchema } = require('../../../utils')

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
        return (400, error, logger);
    }

    var ow = openwhisk();

    try {
        await owClient.actions.invoke({
            name: getRuntimePkgName() + '/' + cbActionName,
            blocking: false,
            result: false,
            params: params
        })
    } catch (error) {
        logger.info(error);
        return{
            "statusCode": 500,
            "body":{
                "error":{
                    "message": "Callback creation failed",
                    "details": error
                }
            }
        }
    }

    return {
        "statusCode": 201
    }

    //Move to secondary action
    const files = await filesLib.init();

    //TODO support tokenized/multiple searches per invocation

    var tableName = params.objectData[0].flowStepContext.table;
    var table;
    try {
        table = await files.read(table);
    } catch (error) {
        logger.info(error);
        return errorResponse(400, error, logger)
    }

    var keyName = params.objectData[0].flowStepContext.keyName;
    var keyValues = new Set();
    params.objectData.forEach((obj) => {
        keyValues.add(obj.objectContext[obj.flowStepContext.keyField])
    })
    var lookup = params.objectData[0].flowStepContext.lookup;
    var results = lts.search(table, keyName, Arrya.from(keyValues), lookup);

    var response = {
        "body": {
            "munchkinId": params.subscription.munchkinId,
            "token": params.token,
            "time": Date.now(),
            "objectData": [
            ]
        }
    }

    params.objectData.forEach((obj) => {
        var kv = obj.objectContext[obj.flowStepContext.keyField];
        var data = {
            "leadData": {
                "id": obj.objectContext.id
            },
            "activityData": {}
        }
        if (results && results[kv]) {
            data.leadData[obj.flowStepContext.resField] = results[kv];
            data.activityData["returnVal"] = results[kv];
            data.activityData["success"] = true;
            response.objectData.push(data)
        } else {
            data.activityData["success"] = false;
            data.activityData["reason"] = "No match found for given key name and value"
        }

    })

    response["statusCode"] = 20
    return
}

module.exports = {
    main,
    schemaKey
}