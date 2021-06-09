const lts = require("../../../lib/lookupTableSearch.js");
const filesLib = require('@adobe/aio-lib-files');
const { Core } = require('@adobe/aio-sdk');
const { errorResponse, getBearerToken, stringParameters, checkMissingRequestInputs, handleFNF } = require('../../utils');

//Searches format = {table},{keyname},{keyval},{lookupname}
//TODO
//Add support for reading action properties to find tables
//handle newline correctly
async function main(params) {
    const files = await filesLib.init();
    const logger = Core.Logger('main', { level: params.LOG_LEVEL || 'info' })
    logger.info("Calling Main Action")
    const requiredParams = ['searches'];
    const requiredHeaders = [
        //'Authorization', 
    ];
    const errorMessage = checkMissingRequestInputs(params, requiredParams, requiredHeaders)
    if (errorMessage) {
        return errorResponse(400, errorMessage, logger)
    }

    var keyMisses = [];
    var errors = [];
    var response = {};

    //TODO handle Null Args
    try {
        var s = splitSearches(params.searches);

        logger.debug('"' + s[0] + '"');
        for (var i = 0; i < s.length; i++) {

            logger.info("entering loop")
            var args = searchArgs(s[i]);
            logger.debug("trying search with params, table: " + args.table + ", keyName: " + args.kn + ", keyVals: " + args.kv + ", lookup:" + args.lookup);

            if (args && args.table && args.kn && args.kv && args.lookup && args.resField) {

                try {
                    try {
                        logger.debug("Trying to get file: " + args.table);
                        var ts = await files.createReadStream(args.table);
                    } catch (error) {
                        logger.debug(error);
                        return await handleFNF(error);
                    }
                    var searchRes = lts.search(ts, args.kn, [args.kv], args.lookup);
                    logger.debug(searchRes);
                    if (searchRes[args.kv]) {
                        response[resField] = searchRes[args.kv];
                    } else {
                        // keyMisses.push(e);
                    }

                    if (searchRes._table && searchRes._table.errors) {
                        errors.push(searchRes._table.errors);
                    }
                } catch (error) {
                    return errorResponse(400, error, logger);
                }
            }
        }

    } catch (error) {
        return errorResponse(500, error, logger)
    }


    /*     if (keyMisses.length > 0) {
            response["_keyMisses"] = keyMissMessage(keyMisses);
        } */
    logger.info(JSON.stringify(response));
    return {
        "body": response,
        "statusCode": 200
    };
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

function splitSearches(searches) {
    return searches.split(";");
}

function searchArgs(search) {
    var args = search.split(",");
    return {
        table: args[0],
        kn: args[1],
        kv: args[2],
        lookup: args[3],
        resField: args[4]
    }
}
module.exports = {
    main,
    splitSearches,
    searchArgs

}