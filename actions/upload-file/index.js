const filesLib = require('@adobe/aio-lib-files')

const fetch = require('node-fetch')
const { Core, Target } = require('@adobe/aio-sdk')
const { errorResponse, getBearerToken, stringParameters, checkMissingRequestInputs, streamToString, parseMultipart, extractBoundary, findHeaderIgnoreCase, getFromParsedBody } = require('../utils')

// main function that will be executed by Adobe I/O Runtime
async function main(params) {
  const files = await filesLib.init()
  // create a Logger
  const logger = Core.Logger('main', { level: params.LOG_LEVEL || 'info' })

  try {
    // 'info' is the default level if not set
    logger.info('Calling the main action')

    // log parameters, only if params.LOG_LEVEL === 'debug'
    //logger.debug(stringParameters(params))

    /* // check for missing request input parameters and headers
    const requiredParams = ['target', 'file'];
    const requiredHeaders = [
      //'Authorization', 
    ];
    const errorMessage = checkMissingRequestInputs(params, requiredParams, requiredHeaders)
    if (errorMessage) {
      // return and log client errors
      return errorResponse(400, errorMessage, logger)
    } */

    var response = {
      body: {}
    };
    var contentType = await findHeaderIgnoreCase(params.__ow_headers, "Content-Type");
    if (contentType && contentType.indexOf("multipart/form-data") > -1) {
      logger.info("Received multpart request")
      try {
        var boundary = await extractBoundary(contentType);

        var parsed = await parseMultipart(params.__ow_body, boundary);
        var target = await getFromParsedBody(parsed, "target");
        var content = await getFromParsedBody(parsed, "file");
        logger.info(streamToString(target));
        await files.write(target, content);
        props = await files.getProperties(params.target);

        response["statusCode"] = 200;
        logger.info(`${response.statusCode}: successful request`);
        //response.body["props"] = props;

      } catch (error) {
        return errorResponse(400, error.message, logger);
      }
      return response;
    }
    else if (contentType && contentType == "application/json") {
 
      try {
        await files.write(params.target, params.file);
        props = await files.getProperties(params.target);
        response["statusCode"] = 200;
        logger.info(`${response.statusCode}: successful request`);
        response.body["props"] = props;
      } catch (error) {
        return errorResponse(400, error.message, logger)
      }
 
      return response; 
    }
  }
  catch (error) {
    // log any server errors
    logger.info(error.message)
    // return with 500
    return errorResponse(500, error.message, logger)
  }
}

exports.main = main
