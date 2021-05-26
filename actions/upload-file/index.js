const filesLib = require('@adobe/aio-lib-files');
const parser = require('multipart-form-parser');
const { Core, Target } = require('@adobe/aio-sdk')
const { errorResponse, getBearerToken, stringParameters, checkMissingRequestInputs, streamToString, extractBoundary, findHeaderIgnoreCase, getFromParsedBody } = require('../utils')

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
    logger.info(params.target);
    var contentType = await findHeaderIgnoreCase(params.__ow_headers, "Content-Type");
    if (contentType && contentType.indexOf("multipart/form-data") > -1) {
      logger.info("Received multpart request")
      try {
        var boundary = await extractBoundary(contentType);
        //logger.debug("Body: " + Buffer.from(params.__ow_body, 'base64').toString());



        var parsed = await parser.Parse(Buffer.from(params.__ow_body, 'base64'), boundary);
        parsed.forEach(element => {
          logger.debug(Object.keys(element));
        });

        var target;
        var content;

        parsed.forEach(element => {
          if(element.name === "target"){
            target = element.data.toString();
          }
          if(element.name === "file"){
            content = element.data;
          }
        });
        //var target = await getFromParsedBody(parsed, "target");
        
        logger.info("target:\r\n" + target);
        //var content = await getFromParsedBody(parsed, "file");
        logger.info("content:\r\n" + content);

        await files.write(target, content);
        props = await files.getProperties(target);

        response["statusCode"] = 200;
        logger.info(`${response.statusCode}: successful request`);
        response.body["props"] = props;

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
