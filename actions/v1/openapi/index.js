const { Core } = require('@adobe/aio-sdk')
const { errorResponse, getBearerToken, stringParameters, checkMissingRequestInputs, handleFNF, validateSchema } = require('../../../lib/actionUtils')
const {swagger} = require("../../../resources/v1/fileSwagger")

function main(params) {
    const logger = Core.Logger('main', { level: params.LOG_LEVEL || 'info' })

    // 'info' is the default level if not set
    logger.info('Calling the main action')

    // log parameters, only if params.LOG_LEVEL === 'debug'
    logger.debug(stringParameters(params))

    return {
        statusCode: 200,
        body: swagger
    }
}
module.exports = { main }