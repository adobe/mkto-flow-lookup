const { Core } = require('@adobe/aio-sdk')
const { errorResponse, getBearerToken, stringParameters, checkMissingRequestInputs, handleFNF, validateSchema } = require('../../../../lib/actionUtils')
const {ioFallbackKey, mktoFallbackToken} = require('../../../../.secrets/auth')
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

    const files = await filesLib.init();

    //Invoker sends params with display names instead of api names so need to remap

    /* params["tableName"] = params["Table"];
    params["keyName"] = params["Key Name"];
    params["keyValField"] = params["Key Value Field"];
    params["lookup"] = params["Lookup Column"];
    params["returnField"] = params["Return Field"]; */

    //TODO support tokenized/multiple searches per invocation

    var tableName = params.objectData[0].flowStepContext.table;
    // var tableName = params.objectData[0].flowStepContext["Table"];
    logger.debug(tableName)
    var table;
    try {
        table = await files.read(tableName);
        logger.debug(`Acquired Table: ${tableName}`)
    } catch (error) {
        logger.info(error);
        return errorResponse(400, error, logger)
    }

    logger.debug(`Starting table search w/ ${tableName}`)
    var keyName = params.objectData[0].flowStepContext.keyName; //"country"
    // var keyName = params.objectData[0].flowStepContext["Key Name"];

    var keyValues = new Set();

    var results;
    try {
        params.objectData.forEach((obj) => {
            keyValues.add(obj.objectContext[obj.flowStepContext.keyValField])// "Zimbabwe"
            // keyValues.add(obj.objectContext[obj.flowStepContext["Key Value Field"]])
        })
        logger.debug("Key Values: " + JSON.stringify(keyValues.values()));

        var lookup = params.objectData[0].flowStepContext.lookupField;// = "alpha-2"
        // var lookup = params.objectData[0].flowStepContext["Lookup Column"];
        results = lts.search(table.toString(), keyName, Array.from(keyValues), lookup);
    } catch (error) {
        logger.info(error);
        return errorResponse(500, error, logger)
    }



    logger.debug(`Search Results: ${JSON.stringify(results)}`);
    var token = params.token;
    if (params.token.indexOf("NTM5") > -1){
        token = mktoFallbackToken;
        console.debug(token)
    }
    var cbData = {
        "munchkinId": params.context.subscription.munchkinId,
        // "munchkin": params.context.subscription.munchkin,
        "token": token,
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
            var kv = obj.objectContext[obj.flowStepContext.keyValField];//"country":"Zimbabwe"
            var data = {
                "leadData": {
                    "id": obj.objectContext.id
                },
                "activityData": {}
            }
            if (results && results[kv]) {
                data.leadData[obj.flowStepContext.resField] = results[kv];//results.Zimbabwe
                // data.leadData[obj.flowStepContext["Return Field"]] = results[kv];
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


    logger.debug(`Callback Data: ${JSON.stringify(cbData)}`);

    try {
        validateSchema(cbSchema, cbData)
    } catch (error) {
        logger.info(error);
        return errorResponse(400, error, logger)
    }

    cbReq["body"] = cbData;
    var cbRes;
    try {
        var callbackUrl;
        if(!params.callbackUrl){
           
            callbackUrl = "https://mkto-cfa-dev.adobe.io/customflowaction/submitCustomFlowAction";
            logger.debug(`Falling back to default callbackUrl: ${callbackUrl}`)
        }else{
            callbackUrl = params.callbackUrl;
        }
        var ioApiKey;
        if(params.apiCallBackKey && params.apiCallBackKey.length > 0  && params.apiCallBackKey != "todo"){
            ioApiKey = params.apiCallBackKey
        }else{
            ioApiKey = ioFallbackKey;
        }

        var headers = { "Content-Type": "application/json", "X-OW-EXTRA-LOGGING": "on", "x-api-key": ioApiKey }
        logger.debug(JSON.stringify(headers))
        cbRes = await fetch(callbackUrl, { body: JSON.stringify(cbData), headers: headers , method: "POST" })
        logger.debug(JSON.stringify(cbRes));
        logger.debug(`CB Status: ${cbRes.status}`)
        //logger.debug(`Callback Response JSON: ${JSON.stringify(await cbRes.json())}`);
    } catch (error) {
        logger.info(error);
        return errorResponse(500, error, logger)
    }
    
    return cbReq;



}

module.exports = {
    main,
    actionName
}