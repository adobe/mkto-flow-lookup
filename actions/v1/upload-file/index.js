const filesLib = require('@adobe/aio-lib-files');
//const parser = require('multipart-form-parser');
const { Core, Target } = require('@adobe/aio-sdk')
const { errorResponse, getBearerToken, stringParameters, checkMissingRequestInputs, extractBoundary, findHeaderIgnoreCase } = require('../../../lib/actionUtils')

const multipart = require('parted').multipart;

const str = require('string-to-stream');





// main function that will be executed by Adobe I/O Runtime
async function main(params) {
  const files = await filesLib.init()
  // create a Logger
  const logger = Core.Logger('main', { level: params.LOG_LEVEL || 'info' })

  try {
    // 'info' is the default level if not set
    logger.info('Calling the main action')

    var response = {
      body: {}
    };
    logger.info(params.target);
    var contentType = await findHeaderIgnoreCase(params.__ow_headers, "Content-Type");
    if (contentType && contentType.indexOf("multipart/form-data") > -1) {
      logger.info("Received multipart request")
      try {
        var parseOpts = {
          limit: 30 * 1024,
          disklimit: 30 * 1024 * 1024
        }
        // var boundary = await extractBoundary(contentType);
        // var parsed = await parser.Parse(Buffer.from(params.__ow_body, 'base64'), boundary);

        var formData = params.__ow_body;
        var fileStream = str(Buffer.from(formData, "base64"));
        
        var parser = new multipart('multipart/form-data', parseOpts);

        //inspired by: https://www.raymondcamden.com/2017/06/09/uploading-files-to-an-openwhisk-action
        // let decoded = new Buffer(args.__ow_body,'base64');
        // let fileStream = str(decoded);

        parser.on('error', function(err) {
          console.log('parser error', err);
        });
    
        parser.on('part', function(field, part) {
          // temporary path or string
          parts[field] = part;
        });
    
        parser.on('data', function() {
          logger.debug('%d bytes written.', this.written);
        });
    
        parser.on('end', function() {
          logger.debug(parts);
        });
    
        fileStream.pipe(parser);




        var target = parts["target"];
        var content = parts[""];

        parsed.forEach(element => {
          if (element.name === "target") {
            target = element.data.toString();
          }
          if (element.name === "file") {
            content = element.data;
          }
        });

        logger.debug("target:\r\n" + target);
        logger.debug("content:\r\n" + content);

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
      logger.debug("Received JSON request");
      logger.debug(stringParameters(params));
      try {
        await files.write(params.target, params.file);
        props = await files.getProperties(params.target);
        if (props) {
          response["statusCode"] = 200;
          logger.info(`${response.statusCode}: successful request`);
          response.body["props"] = props;
          return response;
        } else {
          logger.info(`${response.statusCode}: unsuccessful request, props empty`);
          errorResponse(500, "Something went wrong, no props returned");
        }

      } catch (error) {
        return errorResponse(400, error.message, logger)
      }
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
