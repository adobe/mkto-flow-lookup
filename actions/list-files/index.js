const filesLib = require('@adobe/aio-lib-files')

const fetch = require('node-fetch')
const { Core, Target } = require('@adobe/aio-sdk')
const { errorResponse, getBearerToken, stringParameters, checkMissingRequestInputs } = require('../utils')

// main function that will be executed by Adobe I/O Runtime
async function main(params) {
    const files = await filesLib.init()
    // create a Logger
    const logger = Core.Logger('main', { level: params.LOG_LEVEL || 'info' })

    try {
        // 'info' is the default level if not set
        logger.info('Calling the main action')

        // log parameters, only if params.LOG_LEVEL === 'debug'

        logger.debug(stringParameters(params))
        // check for missing request input parameters and headers

        const requiredParams = ['target'];
        const requiredHeaders = [
            //'Authorization', 
        ];
        const errorMessage = checkMissingRequestInputs(params, requiredParams, requiredHeaders)
        if (errorMessage) {
            // return and log client errors
            return errorResponse(400, errorMessage, logger)
        }

        // extract the user Bearer token from the Authorization header
        const token = getBearerToken(params)

        var response = {
            body: {}
        };
        try {
            files = await files.list(params.target);
            if(!files){
                logger.debug("files is null");
                return errorResponse(404, { message: "Not Found" }, logger);
            }else {
                logger.debug(props);
                response["statusCode"] = 200;
                response.body["files"] = files;
            }

        } catch (error) {
            logger.info("caught error:")
            return errorResponse(400, error, logger);
        }

        return { "payload": response };
    } catch (error) {
        // log any server errors
        logger.error(error)
        // return with 500
        return errorResponse(500, 'server error', logger)
    }
}

exports.main = main
