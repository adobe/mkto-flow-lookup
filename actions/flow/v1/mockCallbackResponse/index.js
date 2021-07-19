const { validateSchema, errorResponse } = require("../../../utils")

function main(params) {
    const logger = Core.Logger('main', { level: params.LOG_LEVEL || 'info' })

    // 'info' is the default level if not set
    logger.info('Calling the main action')

    // log parameters, only if params.LOG_LEVEL === 'debug'
    logger.debug(stringParameters(params))

    try {
        validateSchema("#/components/schemas/flowCallBack", params)
        return { "statusCode": 200 }
    } catch (error) {
        logger.info(error);
        return errorResponse(400, error, logger)
    }
}
module.exports = { main }