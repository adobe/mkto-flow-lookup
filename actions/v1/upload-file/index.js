const filesLib = require('@adobe/aio-lib-files');
//const parser = require('multipart-form-parser');
const { Core, Target } = require('@adobe/aio-sdk')
const { errorResponse, getBearerToken, stringParameters, checkMissingRequestInputs, extractBoundary, findHeaderIgnoreCase } = require('../../../lib/actionUtils')

//const parted = require('parted');

const str = require('string-to-stream');

const Busboy = require('busboy');




// main function that will be executed by Adobe I/O Runtime
async function main(params) {
  // const multipart = parted.multipart;
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

        var stream = str(params.__ow_body)

        var parsed = {}
        var busboy = new busboy(params.__ow_headers)
        busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
          logger.debug('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);
          file.on('data', function(data) {
            logger.debug('File [' + fieldname + '] got ' + data.length + ' bytes');
          });
          file.on('end', function() {
            logger.debug('File [' + fieldname + '] Finished');
          });
        });
        busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
          parsed[fieldname] = val;
          logger.debug('Field [' + fieldname + ']: value: ' + inspect(val));
        });
        busboy.on('finish', function() {
          console.log('Done parsing form!');
        });


    
        stream.pipe(busboy);

        var target = parts["target"];
        var content = parts["file"];

        // parsed.forEach(element => {
        //   if (element.name === "target") {
        //     target = element.data.toString();
        //   }
        //   if (element.name === "file") {
        //     content = element.data;
        //   }
        // });

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
        return errorResponse(400, error, logger)
      }
    }
  }
  catch (error) {
    // log any server errors
    logger.info(error.message)
    // return with 500
    return errorResponse(500, error, logger)
  }
}

exports.main = main
