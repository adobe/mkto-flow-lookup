const lts = require("../../../../lib/lookupTableSearch.js");

/**
 * 
 * @param {string} dir directory string to lookup files from
 * @param {*} filesClient aio files client
 * @returns {Array[object]}
 */
async function tableChoices(dir, filesClient, logger) {
    var choices = [];
    var files = await filesClient.list(dir);
    logger.debug(JSON.stringify(files))
    files.forEach(async f => {
        // logger.debug(JSON.stringify(f))
        choices.push(await choice(f.name, f.name, null, logger))
    })

    return choices
}

/**
 * 
 * @param {string} dir directory string to lookup files from
 * @param {*} filesClient aio files client
 * @returns {Array[object]}
 */
async function knChoices(dir, filesClient, logger) {
    var choices = [];
    var files = await filesClient.list(dir);
    logger.debug(JSON.stringify(files))

    for(var i = 0; i < files.length; i++){
        var table = await filesClient.read(files[i].name)
        var headers = lts.getHeaders(table.toString())
        
        if (headers.length > 0) {
            logger.debug(`headers for ${files[i].name}: ${JSON.stringify(headers)}`)
            for(var j = 0; j < headers.length; j++){
                //removing filename prefix because picklists are broken again
                // var displayValue = `${files[i].name} - ${headers[j]}`
                var displayValue = `${headers[j]}`
                logger.debug(displayValue)
                choices.push(await choice(displayValue, headers[j], null, logger))
                logger.debug(`choices from file ${files[i].name}: ${JSON.stringify(choices)}`)
            }
            
        }
    }
    logger.debug(`choices before returning from choice function ${JSON.stringify(choices)}`)
    return choices
}

/**
 * 
 * @param {*} fieldMappingContext context obj from request
 * @returns {Array[object]}
 */
async function kvChoices(fieldMappingContext, logger) {
    var choices = []
    if(fieldMappingContext != null  && fieldMappingContext.invocation != null && fieldMappingContext.invocation.length > 0){
        for(var i = 0; i < fieldMappingContext.invocation.length; i++ ){
            choices.push(await choice(fieldMappingContext.invocation[i].marketoAttribute, fieldMappingContext.invocation[i].marketoAttribute, null, logger ))
        }
    }


    return choices;
}

/**
 * 
 * @param {string} dir directory string to lookup files from
 * @param {*} filesClient aio files client
 * @returns {Array[object]}
 */
async function lookupChoices(dir, filesClient, logger) {
    var choices = [];
    var files = await filesClient.list(dir);
    logger.debug(JSON.stringify(files))
    // files.forEach(f => {
    //     var headers = lts.getHeaders(f.name)
    //     headers.forEach(async h => {
    //         choices.push(await choice(`${f.name} - ${h}`, "" , null, logger))
    //     })

    // })
    for(var i = 0; i < files.length; i++){
        var table = await filesClient.read(files[i].name)
        var headers = lts.getHeaders(table.toString())
        logger.debug(headers)
        if (headers.length > 0) {
            logger.debug(`headers for ${files[i].name}: ${JSON.stringify(headers)}`)
            for(var j = 0; j < headers.length; j++){
                //removing filename prefix because picklists are broken again
                // var displayValue = `${files[i].name} - ${headers[j]}`
                var displayValue = `${headers[j]}`
                logger.debug(displayValue)
                choices.push(await choice(displayValue, headers[j], null, logger))
                logger.debug(`choices from file ${files[i].name}: ${JSON.stringify(choices)}`)
            }
            
        }
    }
    return choices
}

/**
 * 
 * @param {*} fieldMappingContext context obj from request
 * @returns {Array[object]}
 */
async function rfChoices(fieldMappingContext, logger) {
    var choices = []

    // fieldMappingContext.callback.forEach(async fm => {
    //     choices.push(await choice(fm.marketoAttribute, fm.marketoAttribute))
    // })
    
    if(fieldMappingContext != null  && fieldMappingContext.callback != null && fieldMappingContext.callback.length > 0){
        for(var i = 0; i < fieldMappingContext.callback.length; i++ ){
            choices.push(await choice(fieldMappingContext.callback[i].marketoAttribute, fieldMappingContext.callback[i].marketoAttribute, null, logger ))
        }
    }


    return choices;
}
async function logChoices(logger){
    var choices = [];
    choices.push(await choice("on", true, null, logger));
    choices.push(await choice("off", false, null, logger));
    return choices
}

async function logLvlChoices(logger){
    var choices = [];
    choices.push(await choice("debug", "debug", null, logger));
    choices.push(await choice("info", "info", null, logger));
    choices.push(await choice("warning", "warning", null, logger));
    choices.push(await choice("error", "error", null, logger));
    return choices
}


async function choice(en_US, submitVal, translations, logger) {
    var choice = {
        displayValue: {
            en_US: en_US
        },
        submittedValue: submitVal
    }
    if (translations != null && translations.length > 0) {
        translations.forEach(t => {
            choice.displayValue[t.key] = t.val
        })
    }
    logger.debug(`Choice: ${JSON.stringify(choice)}`)
    return choice
}

module.exports = {
    tableChoices,
    knChoices,
    kvChoices,
    lookupChoices,
    rfChoices,
    logChoices,
    logLvlChoices
}