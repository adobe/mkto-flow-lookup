//Sample action to show standard boilerplate

const { Core } = require('@adobe/aio-sdk')
const { errorResponse, getBearerToken, stringParameters, checkMissingRequestInputs, handleFNF, validateSchema, getRuntimePkgName } = require('../../utils')


const reqSchemaKey = "#/components/schemas/async";



async function main(params) {
    const logger = Core.Logger('main', { level: params.LOG_LEVEL || 'info' })

    // 'info' is the default level if not set
    logger.info('Calling the main action')

    // log parameters, only if params.LOG_LEVEL === 'debug'
    logger.debug(stringParameters(params))

    try {
        validateSchema(reqSchemaKey, params);
    } catch (error) {
        logger.info(error)
        return errorResponse(400, error, logger);
    }
}

module.exports = {
    main,
    reqSchemaKey
}