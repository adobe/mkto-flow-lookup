const lts = require("../../../lib/lookupTableSearch.js");
const filesLib = require('@adobe/aio-lib-files');
const { Core } = require('@adobe/aio-sdk');
const { errorResponse, getBearerToken, stringParameters, checkMissingRequestInputs, handleFNF } = require('../../../lib/actionUtils')

//TODO
//handle newline correctly
async function main(params) {
    const files = await filesLib.init();
    const logger = Core.Logger('main', { level: params.LOG_LEVEL || 'info' })
    logger.info("Calling Main Action")
    const requiredParams = ['table', 'kn', 'kv', 'lookup', 'resField'];
    const requiredHeaders = [
        //'Authorization', 
    ];
    const errorMessage = checkMissingRequestInputs(params, requiredParams, requiredHeaders)
    if (errorMessage) {
        return errorResponse(400, errorMessage, logger)
    }
    logger.debug(stringParameters(params));
    var keyMisses = [];
    var errors = [];
    var response = {};

    try {
        logger.info("trying search with params, table: " + params.table + ", keyName: " + params.kn + ", keyVals: " + params.kv + ", lookup:" + params.lookup);
        var ts;
        try {
            logger.info("Trying to get file: " + params.table);
            var _ts = await files.read(params.table);
            ts = _ts.toString();
        } catch (error) {
            //logger.debug("error: ", error);
            return await handleFNF(error);
        }
        var searchRes = lts.search(ts, params.kn, [params.kv], params.lookup);

        if (!searchRes[params.kv]) {
            return {
                "statusCode": 200,
                "body": {
                    "success": false,
                    "results": searchRes._table
                }
            };
        }
        if (searchRes[params.kv]) {
            response[params.resField] = searchRes[params.kv];
            logger.info(JSON.stringify(response));
            return {
                "body": response,
                "statusCode": 200
            };
        } else {
            return errorResponse(500, "something went wrong", logger)
        }

    } catch (error) {
        logger.debug(error);
        return errorResponse(500, error, logger);
    }

}

function keyMissMessage(keyMisses) {
    var msg = "No value found for following searches:";
    keyMisses.forEach(e => {
        var args = e.split(",");
        var table = args[0];
        var kn = args[1];
        var kv = args[2];
        msg = msg + "\r\nTable: " + table + " Key: " + kn + " Value: " + kv;
    });
    return msg;
}

module.exports = {
    main

}