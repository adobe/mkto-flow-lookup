const { Core } = require('@adobe/aio-sdk')
const { errorResponse, getBearerToken, stringParameters, checkMissingRequestInputs, handleFNF, validateSchema } = require('../../../utils')
const fetch = require('node-fetch')


const lts = require("../../../../lib/lookupTableSearch.js");
const filesLib = require('@adobe/aio-lib-files');

const actionName = "executeCallback";

const cbSchema = "#/components/schemas/flowCallBack"

async function main(params) {
    const logger = Core.Logger('main', { level: params.LOG_LEVEL || 'info' })

    // 'info' is the default level if not set
    logger.info('Calling the main action')

    // log parameters, only if params.LOG_LEVEL === 'debug'
    logger.debug(stringParameters(params))

    //Move to secondary action
    const files = await filesLib.init();

    //TODO support tokenized/multiple searches per invocation

    var tableName = params.objectData[0].flowStepContext.table;
    var table;
    try {
        table = await files.read(tableName);
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

    var cbData = {
        "munchkinId": params.subscription.munchkinId,
        "token": params.token,
        "time": Date.now(),
        "objectData": [
        ]
    };
    var cbReq = {
        "headers": {
            "Content-Type": "application/json"
        },
        "body": {}
    };

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

    cbReq["body"] = cbData;
    try {
        validateSchema(cbSchema, cbReq)
    } catch (error) {
        logger.info(error);
        return errorResponse(500, error, logger)
    }

    var cbRes;
    try {
        cbRes = await fetch(params.callbackUrl, {body: cbReq, "headers": {"Content-Type": "application/json", "X-OW-EXTRA-LOGGING": "on"}, method: "POST"})
    } catch (error) {
        logger.ingo(error);
        return errorResponse(500, error, logger)
    }
    
    return cbRes;

}

module.exports = {
    main
}