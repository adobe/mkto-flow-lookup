const { Core } = require('@adobe/aio-sdk')
const { errorResponse, getBearerToken, stringParameters, checkMissingRequestInputs, handleFNF, validateSchema } = require('../../../../lib/actionUtils')
const lts = require("../../../../lib/lookupTableSearch.js");
const filesLib = require('@adobe/aio-lib-files');
const {tableChoices, knChoices, kvChoices, lookupChoices, rfChoices} = require('./choices')

const actionName = "getPicklist";

const reqSchemaKey = "#/components/schemas/getPicklistRequest"
const respSchemaKey = "#/components/schemas/picklistObject"

async function main(params){
    const logger = Core.Logger('main', { level: params.LOG_LEVEL || 'info' })
    // 'info' is the default level if not set
    logger.info('Calling the main action')

    // log parameters, only if params.LOG_LEVEL === 'debug'
    logger.debug(stringParameters(params))
    try {
        validateSchema(reqSchemaKey, params)
    } catch (error) {
        return errorResponse(400, error, logger)
    }

    const files = await filesLib.init();

    const dir = ""

    var choices;
    try {
        logger.debug(`Trying to get choices for field: ${params.name}`)
        if(params.name === "table"){
            choices = await tableChoices(dir, files, logger)
        }
        if(params.name == "keyName"){
            choices = await knChoices(dir, files, logger)
        }
        if(params.name === "keyValField"){
            choices = await kvChoices(params.fieldMappingContext, logger)
        }
        if(params.name === "lookupField"){
            choices = await lookupChoices(dir, files, logger)
        }
        if(params.name === "returnField"){
            choices = await rfChoices(params.fieldMappingContext, logger)
        }
        logger.debug(`Choices: ${JSON.stringify(choices)}`)
    } catch (error) {
        return errorResponse(500, error, logger)
    }

    var response = {
        statusCode: 200,
        body: {
            "choices": choices
        }
    }
    logger.debug(`Response: ${JSON.stringify(response)}`)
    return response
}
module.exports ={
    main,
    reqSchemaKey,
    respSchemaKey,
    actionName
}