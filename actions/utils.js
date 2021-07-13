
const { Config } = require('@adobe/aio-sdk').Core
const fs = require('fs')

const AJV = require('ajv');
const ajv = new AJV();

// get action url
const namespace = Config.get('runtime.namespace');
const hostname = Config.get('cna.hostname') || 'adobeioruntime.net';
const packagejson = JSON.parse(fs.readFileSync('../package.json').toString());
const runtimePackage = `${packagejson.name}-${packagejson.version}`
const actionPrefix = `https://${namespace}.${hostname}/api/v1/web/${runtimePackage}`

var openwhisk = require('openwhisk');

function getHostname() {
  return hostname;
}

function getRuntimePkgName() {
  return runtimePackage;
}

function getActionPrefix() {
  return actionPrefix;
};

/* function to invoke validate action, passing a schemaName and an object to validate whether it conforms to schema*/
/* async function validateSchema(schemaName, object) {
  var ow;
  try {
    ow = openwhisk();
  } catch (error) {
    return {
      "body": error
    }
  }

  var validRes = await ow.actions.invoke({
    //TODO fix action name acqusition
    name: 'mkto-flow-lookup-0.0.1/validate',
    blocking: true,
    result: true,
    params: {
      "schemaName": "test-schema",
      "object": { "foo": 1, "bar": "baz" }
    }
  });

  return validRes.body.success
} */

/**
 *
 * Returns a log ready string of the action input parameters.
 * The `Authorization` header content will be replaced by '<hidden>'.
 *
 * @param {object} params action input parameters.
 *
 * @returns {string}
 *
 */
function stringParameters(params) {
  // hide authorization token without overriding params
  let headers = params.__ow_headers || {}
  if (headers.authorization) {
    headers = { ...headers, authorization: '<hidden>' }
  }
  return JSON.stringify({ ...params, __ow_headers: headers })
}

/**
 *
 * Returns the list of missing keys giving an object and its required keys.
 * A parameter is missing if its value is undefined or ''.
 * A value of 0 or null is not considered as missing.
 *
 * @param {object} obj object to check.
 * @param {array} required list of required keys.
 *        Each element can be multi level deep using a '.' separator e.g. 'myRequiredObj.myRequiredKey'
 *
 * @returns {array}
 * @private
 */
function getMissingKeys(obj, required) {
  return required.filter(r => {
    const splits = r.split('.')
    const last = splits[splits.length - 1]
    const traverse = splits.slice(0, -1).reduce((tObj, split) => { tObj = (tObj[split] || {}); return tObj }, obj)
    return traverse[last] === undefined || traverse[last] === '' // missing default params are empty string
  })
}

/**
 *
 * Returns the list of missing keys giving an object and its required keys.
 * A parameter is missing if its value is undefined or ''.
 * A value of 0 or null is not considered as missing.
 *
 * @param {object} params action input parameters.
 * @param {array} requiredHeaders list of required input headers.
 * @param {array} requiredParams list of required input parameters.
 *        Each element can be multi level deep using a '.' separator e.g. 'myRequiredObj.myRequiredKey'.
 *
 * @returns {string} if the return value is not null, then it holds an error message describing the missing inputs.
 *
 */
function checkMissingRequestInputs(params, requiredParams = [], requiredHeaders = []) {
  let errorMessage = null

  // input headers are always lowercase
  requiredHeaders = requiredHeaders.map(h => h.toLowerCase())
  // check for missing headers
  const missingHeaders = getMissingKeys(params.__ow_headers || {}, requiredHeaders)
  if (missingHeaders.length > 0) {
    errorMessage = `missing header(s) '${missingHeaders}'`
  }

  // check for missing parameters
  const missingParams = getMissingKeys(params, requiredParams)
  if (missingParams.length > 0) {
    if (errorMessage) {
      errorMessage += ' and '
    } else {
      errorMessage = ''
    }
    errorMessage += `missing parameter(s) '${missingParams}'`
  }

  return errorMessage
}

/**
 *
 * Extracts the bearer token string from the Authorization header in the request parameters.
 *
 * @param {object} params action input parameters.
 *
 * @returns {string|undefined} the token string or undefined if not set in request headers.
 *
 */
function getBearerToken(params) {
  if (params.__ow_headers &&
    params.__ow_headers.authorization &&
    params.__ow_headers.authorization.startsWith('Bearer ')) {
    return params.__ow_headers.authorization.substring('Bearer '.length)
  }
  return undefined
}
/**
 *
 * Returns an error response object and attempts to log.info the status code and error message
 *
 * @param {number} statusCode the error status code.
 *        e.g. 400
 * @param {string} message the error message.
 *        e.g. 'missing xyz parameter'
 * @param {*} [logger] an optional logger instance object with an `info` method
 *        e.g. `new require('@adobe/aio-sdk').Core.Logger('name')`
 *
 * @returns {object} the error object, ready to be returned from the action main's function.
 *
 */
function errorResponse(statusCode, message, logger) {
  if (logger && typeof logger.info === 'function') {
    logger.info(`${statusCode}: ${message}`)
  }
  return {
    error: {
      statusCode,
      body: {
        error: message
      }
    }
  }
}

/* async function streamToString(stream) {
  const chunks = [];
  return new Promise((resolve, reject) => {
      stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
      stream.on('error', (err) => reject(err));
      stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
  })
} */

//TODO, replace w/ multipart library implementation
async function extractBoundary(headerString) {
  var parts = headerString.split(";");
  var boundary;
  parts.forEach(element => {
    if (element.indexOf("boundary") > -1) {
      boundary = element.split("=")[1];
    }
  });
  return boundary;
}

/**  
* Searches headers list for a given header regardless of case
* 
* @param headers {array} Headers list
* @param key {string} Header name to locate
*
* @returns The value of the desired header
*/

async function findHeaderIgnoreCase(headers, key) {
  return headers[Object.keys(headers)
    .find(k => k.toLowerCase() === key.toLowerCase())
  ];
}

async function handleFNF(error, logger) {
  if (error.code == "ERROR_FILE_NOT_EXISTS") {
    return errorResponse(404, error, logger);
  } else throw error;
}

/**
 * Used to validate incoming requests
 * 
 * @param {object} schema Schema to validate against
 * @param {object} object Object to be validated
 * @returns {boolean}
 */

async function validateSchema(schema, object){
  var validator = ajv.compile(schema);
  var result = validator(object);
  return result;
}

module.exports = {
  errorResponse,
  getBearerToken,
  stringParameters,
  checkMissingRequestInputs,
  extractBoundary,
  findHeaderIgnoreCase,
  handleFNF,
  getActionPrefix,
  getHostname,
  getRuntimePkgName,
  validateSchema
}
