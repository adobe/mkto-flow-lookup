const { Core } = require('@adobe/aio-sdk')
const { errorResponse, getBearerToken, stringParameters, checkMissingRequestInputs, handleFNF, validateSchema } = require('../../../../lib/actionUtils.js')

const {sdf} = require("../../../../lib/serviceDefinition.js")

const actionName = "getServiceDefinition";
const respSchemaKey = "#/components/schemas/serviceDefinition";

async function main(params){
    const logger = Core.Logger('main', { level: params.LOG_LEVEL || 'info' })

    // 'info' is the default level if not set
    logger.info('Calling the main action')

    // log parameters, only if params.LOG_LEVEL === 'debug'
    logger.debug(stringParameters(params))

    try {
        validateSchema(respSchemaKey, sdf);
    } catch (error) {
        return errorResponse(400, error, logger)
    }
    return{
        statuscode: 200,
        body: sdf
    }
}

module.exports ={
    main,
    actionName,
    respSchemaKey
}