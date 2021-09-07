const { Core } = require('@adobe/aio-sdk')
const { errorResponse, getBearerToken, stringParameters, handleFNF, validateSchema } = require('../../../../lib/actionUtils')
const {svg} = require('../../../../resources/images/icon')

const actionName = "serviceIcon";

async function main(params){
    const logger = Core.Logger('main', { level: params.LOG_LEVEL || 'info' })
    // 'info' is the default level if not set
    logger.info('Calling the main action')

    // log parameters, only if params.LOG_LEVEL === 'debug'
    logger.debug(stringParameters(params))
    
    try {
        return {
            statusCode: 200,
            headers: [
                {
                    "Content-Type": "image/svg+xml"
                }
            ],
            body: svg

        }
    } catch (error) {
        errorResponse(500, error, logger)
    }
}

module.exports ={
    main
}