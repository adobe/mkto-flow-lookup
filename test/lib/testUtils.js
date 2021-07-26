const { Config } = require('@adobe/aio-sdk').Core
const fs = require('fs')
const fetch = require('node-fetch')

var openwhisk = require('openwhisk');
var ow = openwhisk({"api_key": Config.get("runtime.auth"), "apihost": Config.get("runtime.apihost")});


async function getInitializationError(activationId){
    var act = await ow.activations.get(activationId)
    return act.response.result.error;
}

module.exports = {
    getInitializationError
}