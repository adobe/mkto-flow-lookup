const { errorResponse } = require('../../utils');

const ow = require('openwhisk').openwhisk();

async function main(params){

    const logger = Core.Logger('main', { level: params.LOG_LEVEL || 'info' })
    logger.info("Calling Main Action for Validate")

    logger.debug(stringParameters(params));

    var response = {};
    try{
        var validRes = ow.actions.invoke('validate');
        if (validRes.success){
            return validRes;
        }
    }catch(error){
        logger.info(error);
        return errorResponse(400, console.error(), logger)
    }
}