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
                var displayValue = `${files[i].name} - ${headers[j]}`
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

    for(var i = 0; i < fieldMappingContext.invocation.length; i++ ){
        choices.push(await choice(fieldMappingContext.invocation[i].marketoAttribute, fieldMappingContext.invocation[i].marketoAttribute, null, logger ))
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
                var displayValue = `${files[i].name} - ${headers[j]}`
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
    for(var i = 0; i < fieldMappingContext.callback.length; i++ ){
        choices.push(await choice(fieldMappingContext.callback[i].marketoAttribute, fieldMappingContext.callback[i].marketoAttribute, null, logger ))
    }

    return choices;
}

async function choice(en_US, submitVal, translations, logger) {
    var choice = {
        displayValue: {
            en_US: en_US
        },
        submittedValue: submitVal
    }
    if (translations && translations.length > 0) {
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
    rfChoices
}