# mkto-flow-lookup

This is a proof-of-concept for Marketo Self-service Flow steps on IO Runtime.  It includes a light API implementation of the AIO files library to support managing the list of available files.  

- It currently reads files synchronously and has an unknown maximum file size when executed on a 256mb action
- The specified parts of SSFS API are fully implemented.  Async submission works and the callback produces correct results and validates.  Service Definition is implemented
- End-to-end tests cannot be run locally due to usage of the AIO Files library
- AIO files is currently the only supported file store
  -file uploads limited to 1MB request body due to openwhisk limitations
- lookup search is exact match only


## Setup and configuration

- [Get IO runtime credentials.](https://www.adobe.io/apis/experienceplatform/runtime/docs.html#!adobedocs/adobeio-runtime/master/getting_started.md) then Populate the `.env` file in the project root and fill it as shown [below](#env)
- Create a new IO Project and Workspace, then download your credentials from that workspace.  It will be a .json file named something like: 697GrayKangaroo-208192-Stage.json
- run `aio app use <credentials file>` and follow the prompts to configure the app to use those credentials
- run `npm install` to install local dependencies
- run `aio app deploy` to deploy it
- run `npm run upload-cc` to upload the `country-codes.csv` sample file.
- To get the URI of your swagger file run `aio app get-url` this will be the "serviceSwagger" endpoint
- In your Marketo instance, go to Admin -> Service Providers, then click on Add New Service.  Enter your URI and follow the installation and config steps to complete configuration.
- to make other CSV files available for use, you may use `npm run upload --path=<path of file> --target=<uploaded filename>` 


## Test & Coverage


- `aio app test` is currently bugged on windows, see alternate instructions below
- Run `aio app test` to run unit tests for ui and actions.  
- Run `aio app test -e` to run e2e tests
- Windows: `aio app run -v` in one terminal.  This will hot-reploy when you alter an action if you leave the terminal open
- Windows: `npm test` in another terminal.

## Deploy & Cleanup

- `aio app deploy` to build and deploy all actions on Runtime and static files to CDN
- `aio app undeploy` to undeploy the app

## Config

### `.env`

```bash
# This file must not be committed to source control

## please provide your Adobe I/O Runtime credentials
# AIO_RUNTIME_AUTH=
# AIO_RUNTIME_NAMESPACE=
```

### `manifest.yml`

- List your backend actions under the `actions` field within the `__APP_PACKAGE__`
package placeholder. We will take care of replacing the package name placeholder
by your project name and version.
- For each action, use the `function` field to indicate the path to the action
code.
- More documentation for supported action fields can be found
[here](https://github.com/apache/incubator-openwhisk-wskdeploy/blob/master/specification/html/spec_actions.md#actions).F