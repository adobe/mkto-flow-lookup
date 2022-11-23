const { Config } = require('@adobe/aio-sdk').Core
const fs = require('fs')
const fetch = require('node-fetch')

var openwhisk = require('openwhisk');
var ow = openwhisk({"api_key": Config.get("runtime.auth"), "apihost": Config.get("runtime.apihost")});

/**
 * Returns error message from bad ow activation
 * 
 * @param {string} activationId id of the activation to retrieve error from
 * @returns {string} error message from "dev error" ow invocation
 */
async function getInitializationError(activationId){
    var act = await ow.activations.get(activationId)
    return act.response.result.error;
}

function addOrgHeader(headers){
    headers["x-gw-ims-org-id"] = Config.get("ims.contexts.aio-4566206088344642952.ims_org_id");
}

function addAPIKeyHeader(headers){
    headers['x-require-whisk-auth'] = process.env.WSK_AUTH_SECRET
}

function addAuthHeaders(headers){
    addAPIKeyHeader(headers)
    // addTokenHeader(headers);
    // addOrgHeader(headers)
}
module.exports = {
    getInitializationError,
    addOrgHeader,
    addAuthHeaders
}