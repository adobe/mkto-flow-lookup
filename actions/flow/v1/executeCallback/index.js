const { Core } = require('@adobe/aio-sdk')
const { errorResponse, getBearerToken, stringParameters, checkMissingRequestInputs, handleFNF, validateSchema } = require('../../../utils')
const fetch = require('node-fetch')


const lts = require("../../../../lib/lookupTableSearch.js");
const filesLib = require('@adobe/aio-lib-files');
const { search } = require('../../../../lib/lookupTableSearch.js');

const actionName = "executeCallback";

const cbSchema = "#/components/schemas/flowCallBack"

async function main(params) {
    const logger = Core.Logger('main', { level: params.LOG_LEVEL || 'info' })

    // 'info' is the default level if not set
    logger.info('Calling the main action')

    // log parameters, only if params.LOG_LEVEL === 'debug'
    logger.debug(stringParameters(params))

    const files = await filesLib.init();

    //TODO support tokenized/multiple searches per invocation

    var tableName = params.objectData[0].flowStepContext.table;
    logger.debug(tableName)
    var table;
    try {
        table = await files.read(tableName);
        logger.debug("Acquired Table File")
    } catch (error) {
        logger.info(error);
        return errorResponse(400, error, logger)
    }

    logger.debug("Starting table search")
    var keyName = params.objectData[0].flowStepContext.keyName;
    var keyValues = new Set();

    var results;
    try {
        params.objectData.forEach((obj) => {
            keyValues.add(obj.objectContext[obj.flowStepContext.keyField])
        })
        logger.debug("keyValues: ");
        logger.debug(keyValues.values());

        var lookup = params.objectData[0].flowStepContext.lookup;
        results = lts.search(table.toString(), keyName, Array.from(keyValues), lookup);
    } catch (error) {
        logger.info(error);
        return errorResponse(500, error, logger)
    }



    logger.debug("Search Results");
    logger.debug(results);
    var cbData= {
        "munchkinId": params.context.subscription.munchkinId,
        "token": params.token,
        "time": new Date().toISOString(),
        "objectData": [
        ]
    };

    var cbReq = {
        "headers": {
            "Content-Type": "application/json"
        },
        "body": {}
    };
    

    logger.debug("Starting to map results");
    try {
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
                cbData.objectData.push(data)
            } else {
                data.activityData["success"] = false;
                data.activityData["reason"] = "No match found for given key name and value"
                cbData.objectData.push(data)
            }

        })
    } catch (error) {
        logger.info(error);
        return errorResponse(400, error, logger)
    }


    logger.debug("Callback data:");
    logger.debug(JSON.stringify(cbData));
    
    try {
        validateSchema(cbSchema, cbData)
    } catch (error) {
        logger.info(error);
        return errorResponse(400, error, logger)
    }
    cbReq["body"] = cbData;
    var cbRes;
    try {
        cbRes = await fetch(params.callbackUrl, { body: cbReq, "headers": { "Content-Type": "application/json", "X-OW-EXTRA-LOGGING": "on" }, method: "POST" })
        logger.debug(cbRes);
    } catch (error) {
        logger.info(error);
        return errorResponse(500, error, logger)
    }
    logger.debug(cbRes.json());
    return cbReq;

}

module.exports = {
    main,
    actionName
}