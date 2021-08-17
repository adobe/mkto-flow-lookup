const { Core } = require('@adobe/aio-sdk')
const { Config } = require('@adobe/aio-sdk').Core
const { errorResponse, stringParameters, validateSchema, getRtActionPrefix } = require('../../../../lib/actionUtils.js')

const { getSdf } = require("../../../../lib/serviceDefinition.js")

const actionName = "getServiceDefinition";
const respSchemaKey = "#/components/schemas/serviceDefinition";


async function main(params) {
    const logger = Core.Logger('main', { level: params.LOG_LEVEL || 'info' })


    const namespace = Config.get('runtime.namespace') || process.env.__OW_ACTION_NAME.split('/')[1];
    logger.debug(process.env.__OW_ACTION_NAME)
    const hostname = Config.get('cna.hostname') || 'adobeioruntime.net';

    // 'info' is the default level if not set
    logger.info('Calling the main action')

    // log parameters, only if params.LOG_LEVEL === 'debug'
    logger.debug(stringParameters(params))

    var sdf = getSdf(getRtActionPrefix(process.env, namespace, hostname))
    console.debug(sdf)
    try {
        validateSchema(respSchemaKey, sdf);
    } catch (error) {
        return errorResponse(400, error, logger)
    }
    return {
        statuscode: 200,
        body: sdf
    }
}

module.exports = {
    main,
    actionName,
    respSchemaKey,
    getSdf
}