const filesLib = require('@adobe/aio-lib-files')
const { Core } = require('@adobe/aio-sdk')
const { errorResponse, getBearerToken, stringParameters, checkMissingRequestInputs, handleFNF } = require('../../../lib/actionUtils')

// main function that will be executed by Adobe I/O Runtime
async function main(params) {
    const files = await filesLib.init();
    // create a Logger
    const logger = Core.Logger('main', { level: params.LOG_LEVEL || 'info' })

    try {
        // 'info' is the default level if not set
        logger.info('Calling the main action in list-files');

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
            var filesList;
            try {
                filesList = await files.list(params.target);
                logger.debug("files: ", filesList);
                if (filesList.length <= 0) {
                    response["statusCode"] = 204;
                } else {
                    response["statusCode"] = 200;
                    response.body["files"] = filesList;
                }
               
            } catch (error) {
                logger.debug(error)
                return await handleFNF(error)
            }


        } catch (error) {
            logger.debug(error)
            return errorResponse(400, error, logger);
        }
        return response;
    } catch (error) {
        // log any server errors
        logger.debug(error)
        // return with 500
        return errorResponse(500, 'server error', logger)
    }
}

exports.main = main
